"use server";

import prisma from "@/lib/prisma";
import { applicationDataInclude } from "@/lib/types";
import { cache } from "react";

async function applicationInspections(applicationId: string) {
  return await prisma.$transaction(
    async (tx) => {
      const data = await tx.application.findUnique({
        where: { id: applicationId },
        include: applicationDataInclude,
      });
      if (!data?.inspections.length) {
        return await tx.application.update({
          where: { id: applicationId },
          data: {
            inspections: { create: { decision: "PENDING", visitReport: "" } },
          },
          include: applicationDataInclude,
        });
      } else {
        return data;
      }
    },
    { maxWait: 18000, timeout: 18000 },
  );
}

export const getApplicationInspections = cache(applicationInspections);
