import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// S3_ENDPOINT set → talk to that (e.g. local MinIO). Unset → talk to Cloudflare R2.
const endpoint = process.env.S3_ENDPOINT
  ?? `https://${process.env.R2_ACCOUNT_ID!}.r2.cloudflarestorage.com`;

const client = new S3Client({
  region: "auto",
  endpoint,
  forcePathStyle: !!process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId:     process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function uploadImage(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const key = `blog/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  await client.send(
    new PutObjectCommand({
      Bucket:      process.env.S3_BUCKET_NAME!,
      Key:         key,
      Body:        buffer,
      ContentType: contentType,
    })
  );

  return `${process.env.S3_PUBLIC_URL!}/${key}`;
}
