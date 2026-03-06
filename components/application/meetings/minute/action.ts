"use server";

import { validateRequest } from "@/app/(auth)/auth";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { minuteSchema, MinuteSchema } from "@/lib/validation";

export async function upsertMinute(input: MinuteSchema) {
  const {
    id,
    absentMembersWithApology,
    agendas,
    chairId,
    meetingId,
    presentMembers,
    secretaryId,
  } = minuteSchema.parse(input);

  const { user } = await validateRequest();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.PHYSICAL_PLANNER);
  if (!isAuthorized) throw Error("Unauthorized");
  // prisma.agenda.create({
  //   data: {
  //     minuteId,
  //   },
  // });
  return await prisma.minute.upsert({
    where: { id },
    create: {
      writtenBy: { connect: { id: secretaryId } },
      chairedBy: { connect: { id: chairId } },
      meeting: { connect: { id: meetingId } },
      presentMembers: { connect: presentMembers.map(({ id }) => ({ id })) },
      absentMembersWithApology: {
        connect: absentMembersWithApology.map(({ id }) => ({ id })),
      },
      agendas: { createMany: { data: agendas, skipDuplicates: true } },
    },
    update: {
      writtenBy: { connect: { id: secretaryId } },
      chairedBy: { connect: { id: chairId } },
      meeting: { connect: { id: meetingId } },
      presentMembers: {
        set: [],
        connect: presentMembers.map(({ id }) => ({ id })),
      },

      absentMembersWithApology: {
        set: [],
        connect: absentMembersWithApology.map(({ id }) => ({ id })),
      },
      agendas: {
        deleteMany: {},
        createMany: {
          data: agendas.map((a, index) => ({
            ...a,
            id: crypto.randomUUID(),
            number: index + 1,
          })),
          skipDuplicates: true,
        },
      },
    },
  });
}
