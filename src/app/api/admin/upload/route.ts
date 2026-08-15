import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { uploadImage } from "@/lib/storage";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
// Vercel Serverless Functions hard-cap the request body at 4.5 MB — files
// between 4.5-5 MB were rejected by the platform (413) before reaching this
// handler in production, even though the old 5 MB check passed locally.
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

/** POST /api/admin/upload — upload a cover image to object storage */
export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP and GIF are allowed" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File must be under 4 MB" }, { status: 400 });
  }

  const missingEnv = ["S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY", "S3_BUCKET_NAME", "S3_PUBLIC_URL"]
    .filter((k) => !process.env[k]);
  if (missingEnv.length || (!process.env.S3_ENDPOINT && !process.env.R2_ACCOUNT_ID)) {
    console.error("[upload POST] missing storage env vars:", missingEnv);
    return NextResponse.json({ error: "Storage is not configured on the server" }, { status: 500 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage(buffer, file.name, file.type);
    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.error("[upload POST]", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
