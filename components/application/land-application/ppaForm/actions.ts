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
import { ppaForm1DataInclude } from "@/lib/types";
import { landApplicationSchema, LandApplicationSchema } from "@/lib/validation";
import { cache } from "react";

async function allPpaForm1s() {
  return await prisma.ppaForm1.findMany({ include: ppaForm1DataInclude });
}
export const getAllPpaForm1s = cache(allPpaForm1s);

export async function upsertPpaForm1(input: LandApplicationSchema) {
  const {
    id,
    address,
    landUse,
    natureOfInterest,
    application,
    parcel,
    ppaForm1,
    site,
  } = landApplicationSchema.parse(input);

  const currentYear = new Date().getFullYear();
  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.REGISTRAR);
  if (!isAuthorized) throw Error("Unauthorized");

  if (!id) {
    await prisma.$transaction(
      async (tx) => {
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
                year: application?.year ?? currentYear,
                type: ApplicationType.LAND,
                status: ApplicationStatus.SUBMITTED,
                owners: application?.owners ?? "",
                applicant: { connect: { id: application?.applicant.id } },
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
            amountAssessed: 59000,
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
