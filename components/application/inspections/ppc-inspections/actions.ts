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
  ParentApplicationSchema,
  parentApplicationSchema,
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
  if (!isAuthorized) return "Unauthorized";

  await Promise.all([
    prisma.application.update({
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
    }),
    prisma.workflowStage.update({
      where: { applicationId_step: { applicationId, step: 3 } },
      data: {
        status: "IN_PROGRESS",
        startedAt: new Date(),
        decidedById: user.id,
      },
    }),
  ]);
  // redirect(
  //   redirectUrl || `/admin/inspections/ppc-inspections/${applicationId}`,
  // );
}

export async function editLandInspection({
  landApplication,
  mediaIds,
}: {
  landApplication: ParentApplicationSchema;
  mediaIds: string[];
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
  } = parentApplicationSchema.parse(landApplication);
  const {
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
  if (!isAuthorized) return "Unauthorized";

  const media = mediaIds?.map((mediaId) => ({ id: mediaId })) ?? [];

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
            status: ApplicationStatus.INSPECTED,
            owners: application?.owners ?? "",
            applicant: { connect: { id: application?.applicant.id } },
            workflowStages: {
              update: {
                where: {
                  applicationId_step: {
                    applicationId: application?.id || "",
                    step: 3,
                  },
                },
                data: {
                  status: "COMPLETED",
                  decidedBy: { connect: { id: user.id } },
                  decidedAt: new Date(),
                  decision,
                },
              },
            },
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
    await prisma.document.updateMany({
      where: { id: { in: mediaIds } },
      data: {
        applicationId: application?.id,
        type: "LAND_INSPECTION_REPORT",
        title: "Inspection Media",
        status: "FINAL",
      },
    }),
  ]);
}

export async function editBuildingInspection({
  buildingApplication,
  mediaIds,
}: {
  buildingApplication: ParentApplicationSchema;
  mediaIds: string[];
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
    access,
  } = parentApplicationSchema.parse(buildingApplication);
  const {
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
  if (!isAuthorized) return "Unauthorized";

  const media = mediaIds?.map((mediaId) => ({ id: mediaId })) ?? [];

  await Promise.all([
    await prisma.buildingApplication.update({
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
            // applicationNo: buildingApplicationNumber,
            year: application?.year ?? currentYear,
            type: ApplicationType.BUILDING,
            status: ApplicationStatus.INSPECTED,
            owners: application?.owners ?? "",
            applicant: { connect: { id: application?.applicant.id } },
            workflowStages: {
              update: {
                where: {
                  applicationId_step: {
                    applicationId: application?.id || "",
                    step: 3,
                  },
                },
                data: {
                  status: "COMPLETED",
                  decidedBy: { connect: { id: user.id } },
                  decidedAt: new Date(),
                  decision,
                },
              },
            },
            documents: { connect: media },
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
        access: {
          update: access,
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
    await prisma.document.updateMany({
      where: { id: { in: mediaIds } },
      data: {
        applicationId: application?.id,
        type: "BUILDING_INSPECTION_REPORT",
        title: "Inspection Media",
        status: "FINAL",
      },
    }),
  ]);
}

export async function removeInspectionMedia(input: {
  applicationId: string;
  mediaId: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");

  const { applicationId, mediaId } = input;

  const data = await prisma.application.update({
    where: { id: applicationId },
    data: {
      documents: {
        disconnect: { id: mediaId },
      },
    },
  });
  return data;
}
