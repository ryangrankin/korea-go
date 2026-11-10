-- Korea GO! — everything the app needs in Supabase.
-- Paste into Dashboard → SQL Editor → New query → Run.
-- Safe to run more than once: existing tables and data are kept.
-- (Includes friend requests, so supabase/friend_requests.sql isn't needed after this.)

-- ============ 1. Saved progress (lessons, games, settings) ============
create table if not exists public.korea_go_user_data (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.korea_go_user_data enable row level security;

drop policy if exists "read own data" on public.korea_go_user_data;
create policy "read own data" on public.korea_go_user_data
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "add own data" on public.korea_go_user_data;
create policy "add own data" on public.korea_go_user_data
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "change own data" on public.korea_go_user_data;
create policy "change own data" on public.korea_go_user_data
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============ 2. Profiles: username + picture ============
create table if not exists public.korea_go_profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  username   text not null unique check (username ~ '^[a-z0-9_]{3,20}$'),
  avatar_url text,
  updated_at timestamptz not null default now()
);
alter table public.korea_go_profiles enable row level security;

drop policy if exists "read own profile" on public.korea_go_profiles;
create policy "read own profile" on public.korea_go_profiles
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "add own profile" on public.korea_go_profiles;
create policy "add own profile" on public.korea_go_profiles
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "change own profile" on public.korea_go_profiles;
create policy "change own profile" on public.korea_go_profiles
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Is a username free? (Used on the sign-up page, before logging in.)
drop function if exists public.korea_go_username_available(text);
create or replace function public.korea_go_username_available(name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (select 1 from public.korea_go_profiles where username = lower(trim(name)));
$$;
grant execute on function public.korea_go_username_available(text) to anon, authenticated;

-- ============ 3. Community: every user with a username + game points ============
-- Game results are saved as a JSON string under "koreaGoGameResults".
-- This reads them safely (bad or missing data counts as no games).
create or replace function public.korea_go_game_results(saved jsonb)
returns jsonb
language plpgsql
immutable
as $$
declare
  results jsonb;
begin
  results := (saved ->> 'koreaGoGameResults')::jsonb;
  if jsonb_typeof(results) = 'array' then return results; end if;
  return '[]'::jsonb;
exception when others then
  return '[]'::jsonb;
end;
$$;

drop function if exists public.korea_go_community();
create or replace function public.korea_go_community()
returns table (username text, avatar_url text, total_points integer, games_played integer)
language sql
stable
security definer
set search_path = public
as $$
  select p.username::text,
         p.avatar_url::text,
         coalesce((select sum(coalesce((r ->> 'points')::numeric, 0))::integer
                     from jsonb_array_elements(public.korea_go_game_results(d.data)) r), 0),
         coalesce(jsonb_array_length(public.korea_go_game_results(d.data)), 0)
    from public.korea_go_profiles p
    left join public.korea_go_user_data d on d.user_id = p.user_id
   order by 3 desc, 1;
$$;
revoke all on function public.korea_go_community() from public, anon;
grant execute on function public.korea_go_community() to authenticated;

-- ============ 4. Visitor counter ============
create table if not exists public.korea_go_stats (
  id       integer primary key default 1 check (id = 1),
  visitors integer not null default 0
);
alter table public.korea_go_stats enable row level security;
insert into public.korea_go_stats (id, visitors) values (1, 0) on conflict (id) do nothing;

drop function if exists public.korea_go_count_visit(boolean);
create or replace function public.korea_go_count_visit(new_visitor boolean)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  total integer;
begin
  if new_visitor then
    update public.korea_go_stats set visitors = visitors + 1 where id = 1 returning visitors into total;
  else
    select visitors into total from public.korea_go_stats where id = 1;
  end if;
  return total;
end;
$$;
grant execute on function public.korea_go_count_visit(boolean) to anon, authenticated;

-- ============ 5. Profile pictures (storage bucket) ============
insert into storage.buckets (id, name, public)
values ('korea-go-avatars', 'korea-go-avatars', true)
on conflict (id) do nothing;

drop policy if exists "korea go avatars: read own" on storage.objects;
create policy "korea go avatars: read own" on storage.objects
  for select to authenticated
  using (bucket_id = 'korea-go-avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "korea go avatars: upload own" on storage.objects;
create policy "korea go avatars: upload own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'korea-go-avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "korea go avatars: replace own" on storage.objects;
create policy "korea go avatars: replace own" on storage.objects
  for update to authenticated
  using (bucket_id = 'korea-go-avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ============ 6. Friend requests ============
create table if not exists public.korea_go_friendships (
  id           uuid primary key default gen_random_uuid(),
  requester    uuid not null references auth.users (id) on delete cascade,
  addressee    uuid not null references auth.users (id) on delete cascade,
  status       text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at   timestamptz not null default now(),
  responded_at timestamptz,
  check (requester <> addressee)
);

create unique index if not exists korea_go_friendships_pair
  on public.korea_go_friendships (least(requester, addressee), greatest(requester, addressee));

alter table public.korea_go_friendships enable row level security;

drop policy if exists "read own friendships" on public.korea_go_friendships;
create policy "read own friendships" on public.korea_go_friendships
  for select to authenticated
  using (auth.uid() in (requester, addressee));

create or replace function public.korea_go_send_friend_request(to_username text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  them uuid;
  existing public.korea_go_friendships;
begin
  if me is null then return 'not_logged_in'; end if;

  select user_id into them from public.korea_go_profiles where username = lower(trim(to_username));
  if them is null then return 'not_found'; end if;
  if them = me then return 'self'; end if;

  select * into existing from public.korea_go_friendships
   where (requester = me and addressee = them) or (requester = them and addressee = me);

  if found then
    if existing.status = 'pending' and existing.addressee = me then
      update public.korea_go_friendships
         set status = 'accepted', responded_at = now()
       where id = existing.id;
      return 'accepted';
    end if;
    return 'already';
  end if;

  insert into public.korea_go_friendships (requester, addressee) values (me, them);
  return 'sent';
end;
$$;

create or replace function public.korea_go_respond_friend_request(from_username text, accept boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  them uuid;
begin
  if me is null then return; end if;
  select user_id into them from public.korea_go_profiles where username = lower(trim(from_username));
  if them is null then return; end if;

  if accept then
    update public.korea_go_friendships
       set status = 'accepted', responded_at = now()
     where requester = them and addressee = me and status = 'pending';
  else
    delete from public.korea_go_friendships
     where requester = them and addressee = me and status = 'pending';
  end if;
end;
$$;

create or replace function public.korea_go_remove_friend(other_username text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  them uuid;
begin
  if me is null then return; end if;
  select user_id into them from public.korea_go_profiles where username = lower(trim(other_username));
  if them is null then return; end if;

  delete from public.korea_go_friendships
   where (requester = me and addressee = them) or (requester = them and addressee = me);
end;
$$;

create or replace function public.korea_go_my_friendships()
returns table (username text, avatar_url text, kind text, since timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select p.username::text,
         p.avatar_url::text,
         case
           when f.status = 'accepted' then 'friend'
           when f.addressee = auth.uid() then 'incoming'
           else 'outgoing'
         end,
         coalesce(f.responded_at, f.created_at)
    from public.korea_go_friendships f
    join public.korea_go_profiles p
      on p.user_id = case when f.requester = auth.uid() then f.addressee else f.requester end
   where auth.uid() in (f.requester, f.addressee)
   order by 4 desc;
$$;

revoke all on function public.korea_go_send_friend_request(text) from public, anon;
revoke all on function public.korea_go_respond_friend_request(text, boolean) from public, anon;
revoke all on function public.korea_go_remove_friend(text) from public, anon;
revoke all on function public.korea_go_my_friendships() from public, anon;
grant execute on function public.korea_go_send_friend_request(text) to authenticated;
grant execute on function public.korea_go_respond_friend_request(text, boolean) to authenticated;
grant execute on function public.korea_go_remove_friend(text) to authenticated;
grant execute on function public.korea_go_my_friendships() to authenticated;
