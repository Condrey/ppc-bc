"use server";

import { validateRequest } from "@/app/(auth)/auth";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { paymentDataInclude } from "@/lib/types";
import { paymentSchema, PaymentSchema } from "@/lib/validation";
import { cache } from "react";

async function allPayments() {
  return await prisma.payment.findMany({ include: paymentDataInclude });
}
export const getAllPayments = cache(allPayments);

export async function upsertPayment(input: PaymentSchema) {
  const { id, amountPaid, feeAssessmentId, paymentMethod, referenceNumber } =
    paymentSchema.parse(input);

  // apply auth
  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.APPLICANT);
  if (!isAuthorized) throw Error("Unauthorized");
  return await prisma.payment.upsert({
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
}
