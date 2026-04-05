"use server";

import { validateRequest } from "@/app/(auth)/auth";
import { myPrivileges } from "@/lib/enums";
import {
  ApplicationStatus,
  ApplicationType,
  FeeAssessmentType,
  Role,
} from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { getApplicationFee } from "@/lib/utils";
import {
  ParentApplicationSchema,
  parentApplicationSchema,
  WorkflowSchema,
} from "@/lib/validation";

export async function upsertPpaForm1ForLandApplication(
  input: ParentApplicationSchema,
) {
  const {
    id,
    address,
    landUse,
    natureOfInterest,
    application,
    parcel,
    ppaForm1,
    site,
  } = parentApplicationSchema.parse(input);

  const currentYear = new Date().getFullYear();
  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.REGISTRAR);
  if (!isAuthorized) return "Unauthorized";

  if (!id) {
    await prisma.$transaction(
      async (tx) => {
        const {
          _max: { applicationNo: lastApplicationNumber },
        } = await tx.application.aggregate({
          where: { type: ApplicationType.LAND, year: currentYear },
          _max: { applicationNo: true },
        });
        const newApplicationNumber = (lastApplicationNumber ?? 0) + 1;

        const { applicationId } = await tx.landApplication.create({
          data: {
            natureOfInterest,
            site: {
              create: {
                ...site,
                hasNationalWater: site?.hasNationalWater || false,
                hasElectricity: site?.hasElectricity || false,
                distanceFromFeatures: {
                  create: site?.distanceFromFeatures || {},
                },
              },
            },
            application: {
              create: {
                ...application,
                applicationNo: newApplicationNumber,
                year: application?.year ?? currentYear,
                type: ApplicationType.LAND,
                status: ApplicationStatus.SUBMITTED,
                owners: application?.owners ?? "",
                applicant: { connect: { id: application?.applicant.id } },
                workflowStages: {
                  createMany: {
                    data: initialWorkflowStages.map((d) => ({
                      ...d,
                      startedAt: new Date(),
                      decidedById: user.id,
                      decidedAt: new Date(),
                    })),
                  },
                },
              },
            },
            address: {
              create: address,
            },
            landUse: {
              create: {
                ...landUse,
                doesNotInvolveBuilding: landUse.doesNotInvolveBuilding,
              },
            },
            ppaForm1: {
              create: {
                ...ppaForm1,
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                applicationNumber: ppaForm1?.applicationNumber!,
                year: ppaForm1?.year ?? currentYear,
                shouldHaveNewRoadAccess:
                  ppaForm1?.shouldHaveNewRoadAccess ?? false,
                utility: {
                  create: ppaForm1?.utility,
                },
              },
            },
            parcel: {
              create: {
                ...parcel,
                plotNumber: parcel?.plotNumber ?? "",
                blockNumber: parcel?.blockNumber ?? "",
              },
            },
          },
        });
        console.log(applicationId);
        await tx.feeAssessment.create({
          data: {
            applicationId,
            amountAssessed: getApplicationFee(
              natureOfInterest,
              application?.type || "LAND",
            ),
            assessmentType: FeeAssessmentType.LAND_APPLICATION,
            currency: "Ugx",
            assessedById: application?.applicant.userId ?? "",
          },
        });
      },
      { maxWait: 18000, timeout: 18000 },
    );
  } else {
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
    });
  }
}

export async function upsertPpaForm1ForBuildingApplication(
  input: ParentApplicationSchema,
) {
  const {
    id,
    address,
    landUse,
    natureOfInterest,
    application,
    parcel,
    ppaForm1,
    site,
    access,
  } = parentApplicationSchema.parse(input);

  const currentYear = new Date().getFullYear();
  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.REGISTRAR);
  if (!isAuthorized) return "Unauthorized";

  if (!id) {
    await prisma.$transaction(
      async (tx) => {
        const {
          _max: { applicationNo: lastApplicationNumber },
        } = await tx.application.aggregate({
          where: { type: ApplicationType.BUILDING, year: currentYear },
          _max: { applicationNo: true },
        });
        const newApplicationNumber = (lastApplicationNumber ?? 0) + 1;
        const { applicationId } = await tx.buildingApplication.create({
          data: {
            natureOfInterest,
            site: {
              create: {
                ...site,
                hasNationalWater: site?.hasNationalWater || false,
                hasElectricity: site?.hasElectricity || false,
                distanceFromFeatures: {
                  create: site?.distanceFromFeatures || {},
                },
              },
            },
            application: {
              create: {
                ...application,
                applicationNo: newApplicationNumber,
                year: application?.year ?? currentYear,
                type: ApplicationType.BUILDING,
                status: ApplicationStatus.SUBMITTED,
                owners: application?.owners ?? "",
                applicant: { connect: { id: application?.applicant.id } },
                workflowStages: {
                  createMany: {
                    data: initialWorkflowStages.map((d) => ({
                      ...d,
                      startedAt: new Date(),
                      decidedAt: new Date(),
                      decidedById: user.id,
                    })),
                  },
                },
              },
            },
            address: {
              create: address,
            },
            landUse: {
              create: {
                ...landUse,
                doesNotInvolveBuilding: landUse.doesNotInvolveBuilding,
              },
            },
            ppaForm1: {
              create: {
                ...ppaForm1,
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                applicationNumber: ppaForm1?.applicationNumber!,
                year: ppaForm1?.year ?? currentYear,
                shouldHaveNewRoadAccess:
                  ppaForm1?.shouldHaveNewRoadAccess ?? false,
                utility: {
                  create: ppaForm1?.utility,
                },
              },
            },
            parcel: {
              create: {
                ...parcel,
                plotNumber: parcel?.plotNumber ?? "",
                blockNumber: parcel?.blockNumber ?? "",
              },
            },
            access: {
              create: access,
            },
          },
        });
        console.log(applicationId);
        await tx.feeAssessment.create({
          data: {
            applicationId,
            amountAssessed: getApplicationFee(
              natureOfInterest,
              application?.type || "BUILDING",
            ),
            assessmentType: FeeAssessmentType.BUILDING_APPLICATION,
            currency: "Ugx",
            assessedById: application?.applicant.userId ?? "",
          },
        });
      },
      { maxWait: 18000, timeout: 18000 },
    );
  } else {
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
            // applicationNo: landApplicationNumber,
            year: application?.year ?? currentYear,
            type: ApplicationType.BUILDING,
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
        access: { update: access },
      },
    });
  }
}

const initialWorkflowStages: WorkflowSchema[] = [
  {
    stage: "SUBMISSION",
    step: 1,
    group: "SUBMISSION-PPA FORM1",
    remarks:
      "Filling the Physical planning Act(PPA) Form1 and submitting as required by the guidelines.",
    status: "PENDING",
  },
  {
    stage: "SUBMISSION",
    step: 2,
    group: "SUBMISSION-FEE ASSESSMENT",
    remarks:
      "Processing and paying application fee to the authority. Issuing of a PRN to facilitate application fee payments. This may also include additional fee assessments besides application fees.",
    status: "PENDING",
  },
  {
    stage: "TECHNICAL_REVIEW",
    step: 3,
    group: "TECHNICAL REVIEW: LAND INSPECTION",
    remarks:
      "Carrying out Site inspection & making a survey report by the surveyor. The surveyor and the inspection team checks to see if the site meets the minimum guidelines.",
    status: "PENDING",
  },
  {
    stage: "TECHNICAL_REVIEW",
    step: 4,
    group: "TECHNICAL REVIEW: PARCEL AND PLOTTING",
    remarks:
      "Plotting the geometry(coordinates) of the site and verifying it's parcel number by the Physical Planner.",
    status: "PENDING",
  },
  {
    stage: "PPC_REVIEW",
    step: 5,
    group: "",
    remarks:
      "Physical Planning Committee sitting in a meeting to decide on the application. They can either defer, approve, or reject your application.",
    status: "PENDING",
  },
  {
    stage: "COUNCIL_APPROVAL",
    step: 6,
    group: "",
    remarks:
      "Notification on the decision made by the committee. The Returning Officer offers you a signed and stamped development permission. This permission is not a building permit, obtaining it does not imply commencement of construction.",
    status: "PENDING",
  },
  {
    stage: "BC_REVIEW",
    step: 7,
    group: "",
    remarks:
      "Building Control creates metadata for your application. The metadata is required by the Building Information Management System(BIMS) for your approved development permission. ",
    status: "PENDING",
  },
];
