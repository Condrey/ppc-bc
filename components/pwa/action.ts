"use server";

import { validateRequest } from "@/app/(auth)/auth";
import prisma from "@/lib/prisma";
import { PushSubscription, sendNotification, setVapidDetails } from "web-push";
import z from "zod";

setVapidDetails(
  "mailto:coundreyjames@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

// let subscription: PushSubscription | null = null;
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
    await prisma.pushSubscription.upsert({
      where: { endpoint: parsedValue.endpoint },
      update: {},
      create: {
        userId: user.id,
        endpoint: parsedValue.endpoint,
        p256dh: parsedValue.keys.p256dh,
        auth: parsedValue.keys.auth,
      },
    });
    return { success: true };
  }
}

export async function unsubscribeUser(endpoint: string) {
  const { user } = await validateRequest();
  if (!user) {
    return { success: false };
  } else {
    await prisma.pushSubscription.deleteMany({
      where: {
        userId: user.id,
        endpoint,
      },
    });
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
  recipientUserIds,
}: {
  message: string;
  title?: string;
  tag?: string;
  image?: string;
  url?: string;
  isImportant?: boolean;
  recipientUserIds: string[];
}) {
  const { user } = await validateRequest();

  if (!user) {
    throw Error("Unauthorized!");
  } else {
    // const dbUser = await prisma.user.findFirst({ where: { id: user.id } });

    // if (!dbUser) {
    //   throw new Error("No such user in the database.");
    // }
    try {
      // const sub = dbUser.subscription as PushSubscription | null;
      // if (!sub) throw new Error("No subscription available");
      //       console.log({ sub });

      const subs = await prisma.pushSubscription.findMany({
        where: {
          userId: { in: recipientUserIds || [user.id] },
        },
      });
      if (!subs.length) {
        return { success: false, error: "No subscriptions found" };
      }
      const payload = JSON.stringify({
        title: title || "New Message",
        body: message,
        image: image || "landing-page.jpg",
        tag: tag || "chat-john",
        url: url || "/",
        important: isImportant || false,
      });
      const results = await Promise.allSettled(
        subs.map((sub) =>
          sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            payload,
          ),
        ),
      );
      // ✅ Clean up invalid subscriptions
      const failedEndpoints: string[] = [];

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const err = result.reason;

          // 410 = gone, 404 = invalid → remove
          if (err?.statusCode === 410 || err?.statusCode === 404) {
            failedEndpoints.push(subs[index].endpoint);
          }
        }
      });

      if (failedEndpoints.length > 0) {
        await prisma.pushSubscription.deleteMany({
          where: {
            endpoint: { in: failedEndpoints },
          },
        });
      }

      return {
        success: true,
        sent: results.filter((r) => r.status === "fulfilled").length,
        failed: results.filter((r) => r.status === "rejected").length,
      };
    } catch (error) {
      console.error("Error sending push notification:", error);
      return { success: false, error: "Failed to send notification" };
    }
  }
}
