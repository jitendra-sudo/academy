import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, R2_BUCKET, r2PublicUrl } from "@/lib/r2";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_VIDEO_TYPES = [
  "video/mp4", "video/webm", "video/ogg",
  "video/quicktime", "video/x-msvideo",
  "video/mpeg", "video/3gpp",
];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;   // 5 MB
const MAX_VIDEO_BYTES = 500 * 1024 * 1024; // 500 MB

// POST /api/upload
// FormData fields:
//   file   — the file to upload
//   folder — subfolder: logo | banner | gallery | lectures | general
//   type   — optional: "image" | "video" (auto-detected from mime if omitted)
export async function POST(request) {
  try {
    // Check R2 is configured
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      return Response.json(
        {
          success: false,
          error: "Cloudflare R2 is not configured. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and NEXT_PUBLIC_R2_PUBLIC_URL to your .env.local file.",
          setupRequired: true,
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "general";

    if (!file || typeof file === "string") {
      return Response.json({ success: false, error: "No file provided." }, { status: 400 });
    }

    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);

    if (!isVideo && !isImage) {
      return Response.json(
        {
          success: false,
          error: `File type "${file.type}" not allowed. Images: JPEG, PNG, WebP, GIF, SVG. Videos: MP4, WebM, MOV, AVI.`,
        },
        { status: 400 }
      );
    }

    const maxSize = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxSize) {
      const maxMB = isVideo ? 500 : 5;
      return Response.json(
        { success: false, error: `File too large. Maximum size for ${isVideo ? "videos" : "images"} is ${maxMB}MB.` },
        { status: 400 }
      );
    }

    // Build unique key
    const ext = file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "");
    const timestamp = Date.now();
    const baseName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .toLowerCase()
      .slice(0, 60);
    const key = `${folder}/${timestamp}_${baseName}.${ext}`;

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const client = getR2Client();
    await client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        CacheControl: isVideo
          ? "public, max-age=86400"         // 1 day for videos (may update)
          : "public, max-age=31536000",      // 1 year for images
        ContentDisposition: "inline",
      })
    );

    const publicUrl = r2PublicUrl(key);
    console.log(`[R2 Upload] ${isVideo ? "VIDEO" : "IMAGE"} — ${key} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    return Response.json({
      success: true,
      url: publicUrl,
      key,
      name: file.name,
      size: file.size,
      sizeMB: Math.round(file.size / 1024 / 1024 * 10) / 10,
      type: file.type,
      mediaType: isVideo ? "video" : "image",
    });
  } catch (error) {
    console.error("[Upload API Error]", error);
    return Response.json(
      { success: false, error: "Upload failed: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}

// GET /api/upload — config health check
export async function GET() {
  const configured = !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );

  return Response.json({
    status: "ok",
    r2Configured: configured,
    bucket: configured ? process.env.R2_BUCKET_NAME : null,
    publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL || null,
    limits: {
      imageMB: 5,
      videoMB: 500,
      allowedImageTypes: ALLOWED_IMAGE_TYPES,
      allowedVideoTypes: ALLOWED_VIDEO_TYPES,
    },
  });
}
