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
import { cache } from "react";

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
  if (!isAuthorized) throw Error("Unauthorized");

  return await prisma.meeting.upsert({
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
}

export async function startMeeting(meetingId: string) {
  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.PHYSICAL_PLANNER);
  if (!isAuthorized) throw Error("Unauthorized");

  await prisma.meeting.update({
    where: { id: meetingId },
    data: {
      status: MeetingStatus.IN_PROGRESS,
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
  if (!isAuthorized) throw Error("Unauthorized");
  const { id } = application;
  await prisma.application.update({
    where: { id },
    data: {
      status: decision,
    },
  });
}
