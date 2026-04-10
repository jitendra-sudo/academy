import { S3Client } from "@aws-sdk/client-s3";

// Cloudflare R2 uses S3-compatible API
// Endpoint format: https://<account-id>.r2.cloudflarestorage.com
const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

let _client = null;

export function getR2Client() {
  if (!_client) {
    _client = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
      },
    });
  }
  return _client;
}

export const R2_BUCKET = process.env.R2_BUCKET_NAME || "mentor-merits-assets";
export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";

// Build the public URL for an uploaded file
export function r2PublicUrl(key) {
  return `${R2_PUBLIC_URL}/${key}`;
}

// Allowed image types
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
export const MAX_SIZE_MB = 5;
export const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
