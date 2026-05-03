"use server";

import { validateRequest } from "@/app/(auth)/auth";
import { myPrivileges } from "@/lib/enums";
import { Application } from "@/lib/generated/prisma/browser";
import {
  ApplicationStatus,
  Committee,
  MeetingStatus,
  Role,
} from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { meetingDataInclude } from "@/lib/types";
import { meetingSchema, MeetingSchema } from "@/lib/validation";
import { after } from "next/server";
import { cache } from "react";
import { sendInvitationMessages, sendPostponementNotification } from "./email";

async function allMeetings() {
  return await prisma.meeting.findMany({
    orderBy: { createdAt: "desc" },
    include: meetingDataInclude,
  });
}
export const getAllMeetings = cache(allMeetings);

async function allCommitteeMeetings(committee: Committee) {
  return await prisma.meeting.findMany({
    where: { committee },
    orderBy: { createdAt: "desc" },
    include: meetingDataInclude,
  });
}
export const getAllCommitteeMeetings = cache(allCommitteeMeetings);

async function meetingById(id: string) {
  return await prisma.meeting.findUnique({
    where: { id },
    include: meetingDataInclude,
  });
}
export const getMeetingById = cache(meetingById);

export async function upsertMeeting(input: MeetingSchema) {
  const {
    committee,
    sendInvitations,
    title,
    happeningOn,
    message,
    postponedOn,
    venue,
    id,
  } = meetingSchema.parse(input);

  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.PHYSICAL_PLANNER);
  if (!isAuthorized) return "Unauthorized";

  const data = await prisma.$transaction(
    async (tx) => {
      const applications = await tx.application.findMany({
        where: {
          meetingId: { equals: null },
          // status: { in: ["INSPECTED", "SUBMITTED", "UNDER_REVIEW"] },
        },
      });

      return await tx.meeting.upsert({
        where: { id },
        create: {
          committee,
          sendInvitations,
          title,
          happeningOn,
          message,
          postponedOn,
          venue,
          status: MeetingStatus.PENDING,
          applications: { connect: applications.map((a) => ({ id: a.id })) },
        },
        update: {
          committee,
          sendInvitations,
          title,
          happeningOn,
          message,
          postponedOn,
          venue,
        },
      });
    },
    { maxWait: 18000, timeout: 18000 },
  );
  after(() => {
    if (sendInvitations && data) {
      sendInvitationMessages({ meeting: data, isAnUpdate: !!id });
    }
  });
  return data;
}

export async function startMeeting(meetingId: string) {
  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.PHYSICAL_PLANNER);
  if (!isAuthorized) return "Unauthorized";

  await prisma.meeting.update({
    where: { id: meetingId },
    data: {
      status: MeetingStatus.IN_PROGRESS,
    },
  });
}

export async function postponeMeeting({
  meetingId,
  postponedOn,
}: {
  meetingId: string;
  postponedOn: Date;
}) {
  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.PHYSICAL_PLANNER);
  if (!isAuthorized) return "Unauthorized";

  const data = await prisma.meeting.update({
    where: { id: meetingId },
    data: {
      status: MeetingStatus.POSTPONED,
      postponedOn,
    },
  });
  after(() => {
    if (data) {
      sendPostponementNotification({ meeting: data });
    }
  });
  return data;
}

export async function endMeeting({
  meetingId,
  endedAt,
}: {
  meetingId: string;
  endedAt: Date;
}) {
  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.PHYSICAL_PLANNER);
  if (!isAuthorized) return "Unauthorized";

  await prisma.meeting.update({
    where: { id: meetingId },
    data: {
      status: MeetingStatus.COMPLETED,
      endedAt,
    },
  });
}

export async function decideApplication({
  application,
  decision,
}: {
  application: Application;
  decision: ApplicationStatus;
}) {
  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.PHYSICAL_PLANNER);
  if (!isAuthorized) return "Unauthorized";
  const { id } = application;
  await prisma.application.update({
    where: { id },
    data: {
      status: decision,
      workflowStages: {
        update: {
          where: { applicationId_step: { step: 5, applicationId: id } },
          data: {
            status: "COMPLETED",
            decision:
              decision === "APPROVED"
                ? "APPROVED"
                : decision === "DEFERRED"
                  ? "DEFERRED"
                  : decision === "REJECTED"
                    ? "REJECTED"
                    : "PENDING",
            decidedById: user.id,
            decidedAt: new Date(),
            createdAt: new Date(),
          },
        },
      },
    },
  });
}

export async function addMoreMeetingApplications(meetingId: string) {
  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.PHYSICAL_PLANNER);
  if (!isAuthorized) return "Unauthorized";

  return await prisma.$transaction(
    async (tx) => {
      const applications = await tx.application.findMany({
        where: {
          meetingId: { equals: null },
          // status: { in: ["INSPECTED", "SUBMITTED", "UNDER_REVIEW"] },
        },
      });
      if (!applications.length) {
        return "There are no pending applications to be added. Start by creating new applications first or completing the necessary workflows to make applications viable for a meeting.";
      }
      await tx.meeting.update({
        where: { id: meetingId },
        data: {
          status: MeetingStatus.PENDING,
          applications: { connect: applications.map((a) => ({ id: a.id })) },
        },
      });
    },
    { maxWait: 18000, timeout: 18000 },
  );
}
