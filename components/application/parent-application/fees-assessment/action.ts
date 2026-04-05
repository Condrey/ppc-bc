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
  if (!isAuthorized) return "Unauthorized";
  return await prisma.$transaction(
    async (tx) => {
      // 1. Apply the assessed amount FIRST
      const assessment = await tx.feeAssessment.upsert({
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

      // 2. Compute totals INCLUDING the new payment
      const [assessed, paid] = await Promise.all([
        tx.feeAssessment.aggregate({
          where: { applicationId },
          _sum: { amountAssessed: true },
        }),
        tx.payment.aggregate({
          where: {
            feeAssessment: { applicationId },
          },
          _sum: { amountPaid: true },
        }),
      ]);

      const hasBalance =
        (assessed._sum.amountAssessed ?? 0) > (paid._sum.amountPaid ?? 0);

      // 3. Update workflow stage for stage 2
      const fff = await tx.workflowStage.update({
        where: {
          applicationId_step: { applicationId, step: 2 },
        },
        data: {
          status: hasBalance ? "PENDING" : "COMPLETED",
          decidedBy: { connect: { id: user.id } },
          decidedAt: new Date(),
        },
      });
      console.log({ assessed, paid, hasBalance, fff });
      return assessment;
    },
    { maxWait: 18000, timeout: 18000 },
  );
}
