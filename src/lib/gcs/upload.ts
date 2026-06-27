import { getStorage } from "./client";

export async function uploadReport(pdfBuffer: Buffer, assessmentId: string): Promise<string> {
  const storage = getStorage();
  const bucketName = process.env.GCS_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("GCS_BUCKET_NAME environment variable is required");
  }

  const bucket = storage.bucket(bucketName);
  const filename = `reports/${assessmentId}.pdf`;
  const file = bucket.file(filename);

  await file.save(pdfBuffer, {
    contentType: "application/pdf",
    metadata: {
      cacheControl: "private, max-age=31536000",
    },
  });

  // Make publicly accessible for PDF download link
  await file.makePublic();

  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}
