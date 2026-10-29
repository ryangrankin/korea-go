/*
  Avatar: a round profile picture, or an emoji when there's no picture.
  The size and background come from the className (e.g. "profile-avatar").
*/

type Props = {
  url: string | null | undefined;
  className: string;
  fallback?: string;
};

export default function Avatar({ url, className, fallback = "👤" }: Props) {
  return (
    <span className={`${className} avatar`} aria-hidden="true">
      {/* A plain <img>: these come from Supabase storage and are already small. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {url ? <img src={url} alt="" /> : fallback}
    </span>
  );
}
