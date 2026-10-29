/*
  avatar: profile pictures. The photo is cropped to a square and shrunk to
  256 × 256 in the browser (so uploads are small and fast), then saved to
  the Supabase storage bucket "korea-go-avatars" in the person's own folder.
  Its address goes on their profile (korea_go_profiles.avatar_url).
*/

import { supabase } from "./supabase";
import { PROFILE_CHANGE_EVENT } from "./username";

const BUCKET = "korea-go-avatars";
const SIZE = 256;

// Center-crop to a square and shrink, as a JPEG.
async function shrinkToSquare(file: File): Promise<Blob> {
  const image = await createImageBitmap(file);
  const side = Math.min(image.width, image.height);
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  canvas
    .getContext("2d")!
    .drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, SIZE, SIZE);
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Couldn't read that image."))), "image/jpeg", 0.85)
  );
}

// Returns an error message to show, or null if it worked.
export async function uploadMyAvatar(file: File): Promise<string | null> {
  if (!supabase) return "Accounts aren't set up.";
  const { data: auth } = await supabase.auth.getSession();
  const userId = auth.session?.user.id;
  if (!userId) return "Log in to add a profile picture.";
  if (!file.type.startsWith("image/")) return "Please choose an image file.";

  let picture: Blob;
  try {
    picture = await shrinkToSquare(file);
  } catch {
    return "Couldn't read that image. Try a JPG or PNG.";
  }

  const path = `${userId}/avatar.jpg`;
  const upload = await supabase.storage
    .from(BUCKET)
    .upload(path, picture, { upsert: true, contentType: "image/jpeg" });
  if (upload.error) return upload.error.message;

  // ?v= makes browsers fetch the new picture instead of a cached old one.
  const url = `${supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;
  const { data: updated, error } = await supabase
    .from("korea_go_profiles")
    .update({ avatar_url: url, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select("user_id");
  if (error) return error.message;
  if (!updated?.length) return "Choose a username first, then add a picture.";

  window.dispatchEvent(new Event(PROFILE_CHANGE_EVENT));
  return null;
}
