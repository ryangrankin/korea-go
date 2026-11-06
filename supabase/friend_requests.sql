-- Korea GO! — friend requests
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Safe to run again: everything uses "if not exists" / "create or replace".
--
-- One row per pair of users:
--   requester sent the request, addressee received it.
--   status 'pending'  = waiting for the addressee to accept
--   status 'accepted' = friends (both see each other)
-- Declining, cancelling and unfriending delete the row.
--
-- The app never touches the table directly: it calls the functions below,
-- which look people up by username and only ever act for the logged-in user.

create table if not exists public.korea_go_friendships (
  id           uuid primary key default gen_random_uuid(),
  requester    uuid not null references auth.users (id) on delete cascade,
  addressee    uuid not null references auth.users (id) on delete cascade,
  status       text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at   timestamptz not null default now(),
  responded_at timestamptz,
  check (requester <> addressee)
);

-- Only one row per pair, whichever direction it was sent.
create unique index if not exists korea_go_friendships_pair
  on public.korea_go_friendships (least(requester, addressee), greatest(requester, addressee));

alter table public.korea_go_friendships enable row level security;

-- People can read only rows they're part of. No insert/update/delete
-- policies: changes go through the functions below.
drop policy if exists "read own friendships" on public.korea_go_friendships;
create policy "read own friendships" on public.korea_go_friendships
  for select to authenticated
  using (auth.uid() in (requester, addressee));

-- Send a request to a username.
-- Returns: 'sent', 'accepted' (they had already asked you, so you're now
-- friends), 'already' (request or friendship exists), 'not_found', 'self',
-- or 'not_logged_in'.
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

-- Accept or decline a request someone sent you.
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

-- Unfriend someone, or cancel a request you sent.
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

-- Everyone you're connected to, with their username and picture.
-- kind: 'friend', 'incoming' (they asked you), 'outgoing' (you asked them).
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

-- Only logged-in users can call these.
revoke all on function public.korea_go_send_friend_request(text) from public, anon;
revoke all on function public.korea_go_respond_friend_request(text, boolean) from public, anon;
revoke all on function public.korea_go_remove_friend(text) from public, anon;
revoke all on function public.korea_go_my_friendships() from public, anon;
grant execute on function public.korea_go_send_friend_request(text) to authenticated;
grant execute on function public.korea_go_respond_friend_request(text, boolean) to authenticated;
grant execute on function public.korea_go_remove_friend(text) to authenticated;
grant execute on function public.korea_go_my_friendships() to authenticated;
