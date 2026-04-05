"use server";

import prisma from "@/lib/prisma";
import { applicationDataInclude } from "@/lib/types";
import { cache } from "react";

async function applicationInspections(applicationId: string) {
  const data = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      ...applicationDataInclude,
      _count: { select: { inspections: true } },
    },
  });

  if (!!data?._count.inspections) return data;
  return prisma.application.update({
    where: { id: applicationId },
    data: {
      inspections: {
        create: { decision: "PENDING", visitReport: "" },
      },
      workflowStages: {
        update: {
          where: { applicationId_step: { applicationId, step: 3 } },
          data: { status: "IN_PROGRESS", createdAt: new Date() },
        },
      },
    },
    include: applicationDataInclude,
  });
}

export const getApplicationInspections = cache(applicationInspections);
