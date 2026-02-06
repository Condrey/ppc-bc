"use server";

import { validateRequest } from "@/app/(auth)/auth";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { feeAssessmentDataInclude } from "@/lib/types";
import { feeAssessmentSchema, FeeAssessmentSchema } from "@/lib/validation";
import { cache } from "react";

async function allApplicationFeeAssessments(applicationId: string) {
  return await prisma.feeAssessment.findMany({
    where: { applicationId },
    include: feeAssessmentDataInclude,
  });
}
export const getAllApplicationFeeAssessments = cache(
  allApplicationFeeAssessments,
);

export async function upsertFeeAssessment(input: FeeAssessmentSchema) {
  const { id, amountAssessed, applicationId, assessmentType } =
    feeAssessmentSchema.parse(input);

  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.SURVEYOR);
  if (!isAuthorized) throw Error("Unauthorized");
  return await prisma.feeAssessment.upsert({
    where: { id },
    create: {
      amountAssessed,
      applicationId,
      assessmentType,
      assessedById: user.id,
    },
    update: {
      amountAssessed,
      applicationId,
      assessmentType,
      assessedById: user.id,
    },
  });
}
