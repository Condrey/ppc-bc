"use server";

import { validateRequest } from "@/app/(auth)/auth";
import { myPrivileges } from "@/lib/enums";
import {
  ApplicationDecision,
  ApplicationStatus,
  ApplicationType,
  Role,
} from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { userDataSelect } from "@/lib/types";
import {
  inspectionSchema,
  landApplicationSchema,
  LandApplicationSchema,
} from "@/lib/validation";
import { cache } from "react";

async function committeeMembers() {
  return await prisma.user.findMany({
    where: {
      role: {
        notIn: [Role.APPLICANT, Role.SUPER_ADMIN],
      },
    },
    select: userDataSelect,
  });
}
export const getCommitteeMembers = cache(committeeMembers);

export async function addInspection({
  applicationId,
  redirectUrl,
}: {
  applicationId: string;
  redirectUrl?: string;
}) {
  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.SURVEYOR);
  if (!isAuthorized) throw Error("Unauthorized");

  await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: ApplicationStatus.UNDER_REVIEW,
      inspections: {
        create: {
          decision: ApplicationDecision.PENDING,
          visitReport: "",
          inspectors: { connect: { id: user.id } },
        },
      },
    },
  });
  // redirect(
  //   redirectUrl || `/admin/inspections/ppc-inspections/${applicationId}`,
  // );
}

export async function editLandInspection({
  landApplication,
}: {
  landApplication: LandApplicationSchema;
}) {
  const {
    id,
    address,
    landUse,
    natureOfInterest,
    application,
    parcel,
    ppaForm1,
    site,
    inspection,
  } = landApplicationSchema.parse(landApplication);
  const {
    applicationId,
    carriedOn,
    decision,
    inspectorsIds,
    visitReport,
    id: inspectionId,
  } = inspectionSchema.parse(inspection!);

  const currentYear = new Date().getFullYear();

  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.SURVEYOR);
  if (!isAuthorized) throw Error("Unauthorized");

  await Promise.all([
    await prisma.landApplication.update({
      where: { id },
      data: {
        natureOfInterest,
        site: {
          update: {
            ...site,
            hasNationalWater: site?.hasNationalWater || false,
            hasElectricity: site?.hasElectricity || false,
            distanceFromFeatures: {
              update: site?.distanceFromFeatures || {},
            },
          },
        },
        application: {
          update: {
            ...application,
            // applicationNo: landApplicationNumber,
            year: application?.year ?? currentYear,
            type: ApplicationType.LAND,
            status: ApplicationStatus.SUBMITTED,
            owners: application?.owners ?? "",
            applicant: { connect: { id: application?.applicant.id } },
          },
        },
        address: {
          update: address,
        },
        landUse: {
          update: {
            ...landUse,
            doesNotInvolveBuilding: landUse.doesNotInvolveBuilding,
          },
        },
        ppaForm1: {
          update: {
            ...ppaForm1,
            // applicationNumber: ppa1ApplicationNumber,
            year: ppaForm1?.year ?? currentYear,
            shouldHaveNewRoadAccess: ppaForm1?.shouldHaveNewRoadAccess ?? false,
            utility: {
              update: ppaForm1?.utility,
            },
          },
        },
        parcel: {
          update: {
            ...parcel,
            plotNumber: parcel?.plotNumber ?? "",
            blockNumber: parcel?.blockNumber ?? "",
          },
        },
      },
    }),
    await prisma.inspection.update({
      where: { id: inspectionId },
      data: {
        carriedOn,
        decision,
        visitReport,
        inspectors: {
          set: [],
          connect: inspectorsIds.map((i) => ({ id: i.userId })),
        },
      },
    }),
  ]);
}
