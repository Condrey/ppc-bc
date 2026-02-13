"use server";

import { Committee } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { meetingDataInclude } from "@/lib/types";
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

// export async function upsertUser(
//   input: SignUpSchema,
// ): Promise<string | UserData> {
//   const { email, name, role, username, id } = signUpSchema.parse(input);
//   // apply auth
//   return await prisma.user.upsert({
//     where: { email },
//     create: { email, name, passwordHash, role, username: _username },
//     update: { email, name, role, username: _username },
//     select: userDataSelect,
//   });
// }
