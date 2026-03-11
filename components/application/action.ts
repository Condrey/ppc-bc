"use server";

import prisma from "@/lib/prisma";
import { applicationDataInclude } from "@/lib/types";
import { cache } from "react";

async function applicationInspections(applicationId: string) {
  const data = await prisma.application.findUnique({
    where: { id: applicationId },
    include: applicationDataInclude,
  });
  if (!data?.inspections.length) {
    return await prisma.application.update({
      where: { id: applicationId },
      data: {
        inspections: { create: { decision: "PENDING", visitReport: "" } },
      },
      include: applicationDataInclude,
    });
  } else {
    return data;
  }
}

export const getApplicationInspections = cache(applicationInspections);

// async function allApplications(applicationId: string) {
//   return await prisma.landApplication.findUnique({
//     include: applicationDataInclude,
//   });
// }

// export const getAllApplications = cache(allApplications);

// async function applicationInspections(applicationId: string) {
//   return await prisma.application.findUnique({
//     where: { id: applicationId },
//     include: applicationDataInclude,
//   });
// }

// export const getApplicationInspections = cache(applicationInspections);
