"use server";

import prisma from "@/lib/prisma";
import { applicationDataInclude } from "@/lib/types";
import { cache } from "react";

async function applicationInspections(applicationId: string) {
  return await prisma.application.findUnique({
    where: { id: applicationId },
    include: applicationDataInclude,
  });
}

export const getApplicationInspections = cache(applicationInspections);
