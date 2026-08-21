import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";

export const runtime = "nodejs";

const ALLOWED_EXTENSIONS = [
  ".tsx", ".ts", ".jsx", ".js", ".css", ".scss", ".json", ".md", ".txt",
  ".html", ".zip", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif",
];
// Vercel Serverless Functions hard-cap the request body at 4.5 MB.
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

/** POST /api/admin/components/upload, upload a component source file / cover image */
export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json({ error: `File type ${ext} is not allowed` }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File must be under 4 MB" }, { status: 400 });
  }

  const missingEnv = ["S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY", "S3_BUCKET_NAME", "S3_PUBLIC_URL"]
    .filter((k) => !process.env[k]);
  if (missingEnv.length || (!process.env.S3_ENDPOINT && !process.env.R2_ACCOUNT_ID)) {
    console.error("[components upload POST] missing storage env vars:", missingEnv);
    return NextResponse.json({ error: "Storage is not configured on the server" }, { status: 500 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadFile(buffer, file.name, file.type || "application/octet-stream", "components");
    return NextResponse.json({ success: true, url, name: file.name, size: file.size });
  } catch (err) {
    console.error("[components upload POST]", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
