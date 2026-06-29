import { getStorage } from "./client";

const SIGNED_URL_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

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
      cacheControl: "private, max-age=604800",
    },
  });

  const [signedUrl] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + SIGNED_URL_EXPIRY_MS,
  });

  return signedUrl;
}

// Call this when a user loads the report page to get a fresh download link
export async function getReportSignedUrl(assessmentId: string): Promise<string> {
  const storage = getStorage();
  const bucketName = process.env.GCS_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("GCS_BUCKET_NAME environment variable is required");
  }

  const file = storage.bucket(bucketName).file(`reports/${assessmentId}.pdf`);
  const [signedUrl] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + SIGNED_URL_EXPIRY_MS,
  });

  return signedUrl;
}
