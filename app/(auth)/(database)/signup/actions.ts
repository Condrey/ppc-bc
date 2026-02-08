"use server";

import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { applicantSchema, ApplicantSchema } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { createSession } from "../../lib/session";
import { generateSessionToken, setSessionTokenCookie } from "../../lib/tokens";

export async function signUp(
  credentials: ApplicantSchema,
): Promise<{ error: string }> {
  const { email, name, address, contact, password } =
    applicantSchema.parse(credentials);
  let username = slugify(name);
  const passwordHash = await hash(password!, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const existingUserName = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
  });
  if (existingUserName) {
    username = slugify(username + contact);
  }
  const existingEmail = await prisma.user.findFirst({
    where: {
      email: {
        equals: email!,
        mode: "insensitive",
      },
    },
  });
  if (existingEmail) {
    return {
      error:
        "Email is already taken or has been used to register before, just login",
    };
  }

  const { user } = await prisma.applicant.create({
    data: {
      address,
      contact,
      name,
      user: {
        create: {
          username: username!,
          name,
          email: email!,
          passwordHash,
        },
      },
    },
    include: { user: true },
  });

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);

  return redirect("/admin");
}
