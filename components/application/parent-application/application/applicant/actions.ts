"use server";

import { DEFAULT_PASSWORD } from "@/lib/constants";
import { Role } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { applicantDataInclude } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { applicantSchema, ApplicantSchema } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { cache } from "react";

async function allApplicants() {
  return await prisma.applicant.findMany({ include: applicantDataInclude });
}
export const getAllApplicants = cache(allApplicants);

export async function upsertApplicant(input: ApplicantSchema) {
  const { id, address, contact, name, email } = applicantSchema.parse(input);

  const passwordHash = await hash(DEFAULT_PASSWORD, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const username = slugify(name);

  // apply auth
  return await prisma.applicant.upsert({
    where: { id },
    create: {
      address,
      contact,
      name,
      email,
      user: {
        connectOrCreate: {
          where: { email: email! },
          create: {
            email: email!,
            name,
            username,
            role: Role.APPLICANT,
            passwordHash,
          },
        },
      },
    },
    update: {
      address,
      contact,
      name,
      email,
      user: {
        update: { email: email!, name, username, passwordHash },
      },
    },
    include: applicantDataInclude,
  });
}
