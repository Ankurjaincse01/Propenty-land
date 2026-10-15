import { v2 as cloudinary } from "cloudinary";

const configured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (configured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export const cloudinaryEnabled = configured;

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const MAX_UPLOAD_BYTES = 6 * 1024 * 1024; // 6 MB

export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

/**
 * Upload a base64 data URI or remote URL to Cloudinary.
 * Falls back to storing the data URI directly when Cloudinary is not configured
 * so the app remains fully usable in local/demo mode.
 */
export async function uploadImage(
  file: string,
  folder = "greenland-estates"
): Promise<UploadResult> {
  if (!configured) {
    return { url: file, publicId: `local_${Date.now()}` };
  }
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "image",
    quality: "auto",
    fetch_format: "auto",
  });
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  if (!configured || !publicId || publicId.startsWith("local_")) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("[cloudinary] delete failed", err);
  }
}

export function validateImageDataUrl(dataUrl: string): { ok: boolean; error?: string } {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return { ok: false, error: "Invalid image payload" };
  const [, mime, b64] = match;
  if (!ALLOWED.includes(mime)) {
    return { ok: false, error: `Unsupported format: ${mime}. Use JPG, PNG, WebP or AVIF.` };
  }
  const bytes = Math.floor((b64.length * 3) / 4);
  if (bytes > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Image exceeds the 6 MB limit" };
  }
  return { ok: true };
}

export default cloudinary;
