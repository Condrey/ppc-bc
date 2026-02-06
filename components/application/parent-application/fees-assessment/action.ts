"use client";

import prisma from "@/lib/prisma";
import { feeAssessmentDataInclude } from "@/lib/types";
import { cache } from "react";

async function feeAssessmentById(id: string) {
  return await prisma.feeAssessment.findFirst({
    where: { id },
    select: feeAssessmentDataInclude,
  });
}
export const getFeeAssessmentById = cache(feeAssessmentById);
