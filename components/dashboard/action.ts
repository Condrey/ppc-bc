"use server";
import { FeeAssessmentType } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { DashboardItems } from "@/lib/types";
import { getFiscalYearRange } from "@/lib/utils";
import { cache } from "react";

async function dashboardInfo() {
  const { start, end } = getFiscalYearRange(new Date());
  const [
    users,
    landApplications,
    buildingApplications,
    feeAssessments,
    meetings,
    landUse,
  ] = await Promise.all([
    await prisma.user.findMany({
      where: { role: { notIn: ["SUPER_ADMIN"] } },
    }),
    await prisma.landApplication.findMany({
      select: { application: true },
      orderBy: { application: { createdAt: "desc" } },
    }),
    await prisma.buildingApplication.findMany({
      select: { application: true },
      orderBy: { application: { createdAt: "desc" } },
    }),
    await prisma.$queryRaw`
    SELECT 
      EXTRACT(MONTH FROM "assessedAt")  AS month,
      "assessmentType" as type,
      SUM("amountAssessed") as amount
    FROM "FeeAssessment"
    WHERE "assessedAt" BETWEEN ${start} AND ${end}
    GROUP BY month, type
    ORDER BY month;
      `,
    await prisma.meeting.findMany({
      orderBy: [{ postponedOn: "desc" }, { happeningOn: "desc" }],
    }),
    await prisma.landUse.groupBy({
      by: "landUseType",
      _count: { landUseType: true },
    }),
  ]);

  const applicants = users.filter((d) => d.role === "APPLICANT").length;
  const admins = users.filter((d) => d.role !== "APPLICANT").length;
  const approvedLandApplications = landApplications.filter(
    (l) => l.application.status === "APPROVED",
  ).length;
  const deferredLandApplications = landApplications.filter(
    (l) => l.application.status === "DEFERRED",
  ).length;
  const rejectedLandApplications = landApplications.filter(
    (l) => l.application.status === "REJECTED",
  ).length;
  const approvedBuildingApplications = buildingApplications.filter(
    (l) => l.application.status === "APPROVED",
  ).length;
  const deferredBuildingApplications = buildingApplications.filter(
    (l) => l.application.status === "DEFERRED",
  ).length;
  const rejectedBuildingApplications = buildingApplications.filter(
    (l) => l.application.status === "REJECTED",
  ).length;
  const firstLandApplication = !landApplications.length
    ? undefined
    : landApplications[0];
  const firstBuildingApplication = !buildingApplications.length
    ? undefined
    : buildingApplications[0];

  const landUsage = landUse.map((a) => ({
    type: a.landUseType,
    count: a._count.landUseType,
  }));
  const count = meetings.length;
  const recentMeeting = !count ? undefined : meetings[0];
  const fees = feeAssessments as {
    month: string;
    type: FeeAssessmentType;
    amount: number;
  }[];
  return {
    admins,
    applicants,
    feesAssessment: { fees, start, end },
    landUsage,
    meeting: { recentMeeting, count },

    landApplication: {
      approvedLandApplications,
      deferredLandApplications,
      rejectedLandApplications,
      count: landApplications.length,
      firstApplication: firstLandApplication,
    },
    buildingApplication: {
      approvedBuildingApplications,
      deferredBuildingApplications,
      rejectedBuildingApplications,
      count: buildingApplications.length,
      firstApplication: firstBuildingApplication,
    },
  } satisfies DashboardItems;
}
export const getDashboardInfo = cache(dashboardInfo);
