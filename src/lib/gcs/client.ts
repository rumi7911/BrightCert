import { Storage } from "@google-cloud/storage";

let storageClient: Storage | null = null;

export function getStorage(): Storage {
  if (!storageClient) {
    if (!process.env.GCS_PROJECT_ID || !process.env.GCS_CLIENT_EMAIL || !process.env.GCS_PRIVATE_KEY) {
      throw new Error("Google Cloud Storage credentials are not configured");
    }
    storageClient = new Storage({
      projectId: process.env.GCS_PROJECT_ID,
      credentials: {
        client_email: process.env.GCS_CLIENT_EMAIL,
        private_key: process.env.GCS_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
    });
  }
  return storageClient;
}
