"use server";

import { validateRequest } from "@/app/(auth)/auth";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { paymentDataInclude } from "@/lib/types";
import { paymentSchema, PaymentSchema } from "@/lib/validation";

export async function upsertPayment({
  input,
  applicationId,
}: {
  input: PaymentSchema;
  applicationId: string;
}) {
  const { id, amountPaid, feeAssessmentId, paymentMethod, referenceNumber } =
    paymentSchema.parse(input);

  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.APPLICANT);
  if (!isAuthorized) return "Unauthorized";

  return await prisma.$transaction(
    async (tx) => {
      // 1. Apply the new payment FIRST
      const payment = await tx.payment.upsert({
        where: { id },
        create: {
          amountPaid,
          feeAssessmentId,
          paymentMethod,
          referenceNumber,
          receivedById: user.id,
        },
        update: {
          amountPaid,
          feeAssessmentId,
          paymentMethod,
          referenceNumber,
        },
        include: paymentDataInclude,
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

      // 3. Update workflow stages in parallel
      await Promise.all([
        tx.workflowStage.update({
          where: {
            applicationId_step: { applicationId, step: 2 },
          },
          data: {
            status: hasBalance ? "PENDING" : "COMPLETED",
            startedAt: hasBalance ? undefined : new Date(),
            decidedBy: { connect: { id: user.id } },
          },
        }),
        tx.workflowStage.update({
          where: {
            applicationId_step: { applicationId, step: 1 },
          },
          data: {
            status: "COMPLETED",
          },
        }),
      ]);

      return payment;
    },
    { maxWait: 18000, timeout: 18000 },
  );
}
