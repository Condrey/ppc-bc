"use server";

import prisma from "@/lib/prisma";
import { landApplicationDataInclude } from "@/lib/types";
import { cache } from "react";

async function allLandApplications() {
  return await prisma.landApplication.findMany({
    include: landApplicationDataInclude,
  });
}
export const getAllLandApplications = cache(allLandApplications);
