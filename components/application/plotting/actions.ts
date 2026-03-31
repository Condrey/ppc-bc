"use server";

import { validateRequest } from "@/app/(auth)/auth";
import { myPrivileges } from "@/lib/enums";
import { Parcel } from "@/lib/generated/prisma/client";
import { Role } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { userDataSelect } from "@/lib/types";
import { getPolygonArea, getPolygonCentroid } from "@/lib/utils";
import {
  ParentApplicationSchema,
  parentApplicationSchema,
} from "@/lib/validation";
import { cache } from "react";

async function allOtherParcels(exceptionId: string) {
  const data = await prisma.parcel.findMany({
    where: {
      id: { not: exceptionId },
    },
    include: {
      buildingApplication: {
        select: {
          application: {
            select: {
              applicant: {
                select: {
                  user: { select: userDataSelect },
                  contact: true,
                  email: true,
                },
              },
            },
          },
        },
      },
      landApplication: {
        select: {
          application: {
            select: {
              applicant: {
                select: {
                  user: { select: userDataSelect },
                  contact: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return data.map((d) => {
    const parentApplication = d.landApplication ?? d.buildingApplication!;
    const applicant = parentApplication.application.applicant;
    return {
      ...(d as Parcel),
      applicant,
    };
  });
}
export const getAllOtherParcels = cache(allOtherParcels);

export async function upsertParcel(input: ParentApplicationSchema) {
  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.PHYSICAL_PLANNER);
  if (!isAuthorized) return "Unauthorized";
  const { parcel } = parentApplicationSchema.parse(input);
  if (!parcel) return;
  const { blockNumber, plotNumber, geometry, id, parcelNumber } = parcel;

  const centroid = getPolygonCentroid(geometry!);
  const { sqm, acres } = getPolygonArea(geometry!);

  await prisma.parcel.upsert({
    where: { id },
    create: {
      blockNumber,
      plotNumber,
      geometry,
      parcelNumber,
      centroid: centroid ?? undefined,
      areaSqMeters: sqm,
      areaAcres: acres,
    },
    update: {
      blockNumber,
      plotNumber,
      geometry,
      parcelNumber,
      centroid: centroid ?? undefined,
      areaSqMeters: sqm,
      areaAcres: acres,
    },
  });
}
