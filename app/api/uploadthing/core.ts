import { validateRequest } from "@/app/(auth)/auth";
import { MAX_ATTACHMENTS } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
const f = createUploadthing();

const avatarRouter = f({
  image: { maxFileSize: "512KB" },
})
  .middleware(async () => {
    const { user } = await validateRequest();
    if (!user) throw new UploadThingError("Unauthorized");
    return { user };
  })
  .onUploadComplete(async ({ metadata, file }) => {
    const oldAvatarUrl = metadata.user.avatarUrl;
    if (oldAvatarUrl) {
      const key = oldAvatarUrl.split(
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      )[1];
      await new UTApi().deleteFiles(key);
    }

    const newAvatarUrl = file.url.replace(
      "/f/",
      `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
    );

    await prisma.user.update({
      where: { id: metadata.user.id },
      data: {
        avatarUrl: newAvatarUrl,
      },
    });

    return { avatarUrl: newAvatarUrl };
  });

const file_document = f({
  image: { maxFileSize: "16MB", maxFileCount: MAX_ATTACHMENTS },
  video: { maxFileSize: "32MB", maxFileCount: MAX_ATTACHMENTS },
  pdf: { maxFileSize: "16MB", maxFileCount: MAX_ATTACHMENTS },
})
  .middleware(async () => {
    const { user } = await validateRequest();
    if (!user) throw new UploadThingError("Unauthorized");
    return { user };
  })

  .onUploadComplete(async (item) => {
    const { file, metadata } = item;
    const extension = file.name.split(".").pop();
    const fileUrl = file.url.replace(
      "/f/",
      `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
    );
    const media = await prisma.document.create({
      data: {
        fileUrl: file.url.replace(
          "/f/",
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        ),
        createdById: metadata.user.id,
        extension: extension!,
        title: file.name,
        mediaType: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
      },
    });
    return { fileUrl, mediaId: media.id };
  });

export const appFileRouter = {
  avatar: avatarRouter,
  fileDocumentRouter: file_document,
} satisfies FileRouter;

export type AppFileRouter = typeof appFileRouter;
