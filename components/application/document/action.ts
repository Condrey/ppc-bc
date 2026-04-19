"use server";

import { validateRequest } from "@/app/(auth)/auth";
import prisma from "@/lib/prisma";

export async function removeMedia(input: {
  applicationId: string;
  mediaId: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");

  const { applicationId, mediaId } = input;

  const data = await prisma.application.update({
    where: { id: applicationId },
    data: {
      documents: {
        disconnect: { id: mediaId },
      },
    },
  });
  return data;
}
