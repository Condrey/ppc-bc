"use server";

import { validateRequest } from "@/app/(auth)/auth";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import {
  ParentApplicationSchema,
  parentApplicationSchema,
} from "@/lib/validation";

export async function upsertParcel(input: ParentApplicationSchema) {
  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.PHYSICAL_PLANNER);
  if (!isAuthorized) throw Error("Unauthorized");
  const { parcel } = parentApplicationSchema.parse(input);
  if (!parcel) return;
  const { blockNumber, plotNumber, areaSqMeters, geometry, id, parcelNumber } =
    parcel;
  await prisma.parcel.upsert({
    where: { id },
    create: {
      blockNumber,
      plotNumber,
      areaSqMeters,
      geometry,
      parcelNumber,
    },
    update: {
      blockNumber,
      plotNumber,
      areaSqMeters,
      geometry,
      parcelNumber,
    },
  });
}
