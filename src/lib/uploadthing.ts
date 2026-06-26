import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const f = createUploadthing();

async function requireUploaderSession({ req }: { req: NextRequest }) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    throw new UploadThingError("Unauthorized");
  }
  return { userId: session.user.id };
}

// UploadThing's FileSize type only accepts powers of 2 (8MB, 16MB, ...), so
// these are generous ceilings. The actual spec'd limits (10MB / 5MB) are
// enforced client-side in DocumentUploadField before the upload even starts.
export const ourFileRouter = {
  membershipDocument: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
    pdf: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(requireUploaderSession)
    .onUploadComplete(async ({ metadata, file }) => ({
      uploadedBy: metadata.userId,
      url: file.ufsUrl,
      name: file.name,
      size: file.size,
    })),

  paymentProof: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(requireUploaderSession)
    .onUploadComplete(async ({ metadata, file }) => ({
      uploadedBy: metadata.userId,
      url: file.ufsUrl,
      name: file.name,
      size: file.size,
    })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
