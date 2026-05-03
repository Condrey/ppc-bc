"use server";

import { validateRequest } from "@/app/(auth)/auth";
import prisma from "@/lib/prisma";
import webpush, { PushSubscription } from "web-push";
import z from "zod";

webpush.setVapidDetails(
  "mailto:coundreyjames@gmail.com.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

let subscription: PushSubscription | null = null;
const schema = z.object({
  endpoint: z.string(),
  expirationTime: z.number().nullish(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export async function subscribeUser(sub: PushSubscription) {
  const parsedValue = schema.parse(sub);

  const { user } = await validateRequest();
  if (!user) {
    return { success: false };
  } else {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        subscription: parsedValue,
      },
    });
    // In a production environment, you would want to store the subscription in a database
    // For example: await db.subscriptions.create({ data: sub })
    return { success: true };
  }
}

export async function unsubscribeUser() {
  subscription = null;
  const { user } = await validateRequest();
  if (!user) {
    return { success: false };
  } else {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        subscription: undefined,
      },
    });
    // In a production environment, you would want to remove the subscription from the database
    // For example: await db.subscriptions.delete({ where: { ... } })
    return { success: true };
  }
}

export async function sendWebPushNotification({
  message,
  title,
  image,
  tag,
  url,
  isImportant,
}: {
  message: string;
  title?: string;
  tag?: string;
  image?: string;
  url?: string;
  isImportant?: boolean;
}) {
  const { user } = await validateRequest();
  if (!user) {
    throw Error("Unauthorized!");
  } else {
    const dbUser = await prisma.user.findFirst({ where: { id: user.id } });

    if (!dbUser) {
      throw new Error("No such user in the database.");
    }
    try {
      const sub = dbUser.subscription as PushSubscription | null;
      if (!sub) throw new Error("No subscription available");
      console.log({ sub });
      await webpush.sendNotification(
        sub,
        JSON.stringify({
          title: title || "New Message",
          body: message,
          image: image || "landing-page.jpg",
          tag: tag || "chat-john",
          url: url || "/",
          important: isImportant || false,
        }),
      );
      return { success: true };
    } catch (error) {
      console.error("Error sending push notification:", error);
      return { success: false, error: "Failed to send notification" };
    }
  }
}
