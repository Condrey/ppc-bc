"use server";

import {
  ApplicationType,
  FeeAssessmentType,
} from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import {
  buildingApplicationDataInclude,
  landApplicationDataInclude,
  ParentApplicationData,
} from "@/lib/types";
import { cache } from "react";

async function allLandApplications() {
  return await prisma.landApplication.findMany({
    include: landApplicationDataInclude,
  });
}
export const getAllLandApplications = cache(allLandApplications);

async function landApplicationById(id: string) {
  return await prisma.landApplication.findFirst({
    where: { id },
    include: landApplicationDataInclude,
  });
}
export const getLandApplicationById = cache(landApplicationById);

async function buildingApplicationById(id: string) {
  return await prisma.buildingApplication.findFirst({
    where: { id },
    include: buildingApplicationDataInclude,
  });
}
export const getBuildingApplicationById = cache(buildingApplicationById);

async function parentApplicationById(
  id: string,
  applicationType: ApplicationType,
): Promise<ParentApplicationData | null> {
  return await (applicationType === ApplicationType.BUILDING
    ? getBuildingApplicationById(id)
    : getLandApplicationById(id));
}
export const getParentApplicationById = cache(parentApplicationById);

async function allParentApplications(): Promise<ParentApplicationData[]> {
  const _data = await prisma.application.findMany({
    select: {
      buildingApplication: { include: { ...buildingApplicationDataInclude } },
      landApplication: { include: landApplicationDataInclude },
    },
    orderBy: { createdAt: "desc" },
  });
  const data = _data
    .map((d) => [d.buildingApplication, d.landApplication!])
    .flat()
    .filter(Boolean) as ParentApplicationData[];

  return data;
}
export const getAllParentApplications = cache(allParentApplications);

async function allParentApplicationsByFeeAssessmentType(
  assessmentType: FeeAssessmentType,
): Promise<ParentApplicationData[]> {
  const _data = await prisma.application.findMany({
    where: { feeAssessments: { every: { assessmentType } } },
    select: {
      buildingApplication: { include: { ...buildingApplicationDataInclude } },
      landApplication: { include: landApplicationDataInclude },
    },
    orderBy: { createdAt: "desc" },
  });
  const data = _data
    .map((d) => [d.buildingApplication, d.landApplication!])
    .flat()
    .filter(Boolean) as ParentApplicationData[];

  return data;
}
export const getAllParentApplicationsByFeeAssessmentType = cache(
  allParentApplicationsByFeeAssessmentType,
);
