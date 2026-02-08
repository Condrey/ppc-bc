"use server";

import { DEFAULT_PASSWORD } from "@/lib/constants";
import { Role } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { UserData, userDataSelect } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { signUpSchema, SignUpSchema } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { cache } from "react";

async function allUsers() {
  return await prisma.user.findMany({
    where: { role: { notIn: [Role.SUPER_ADMIN] } },
    select: userDataSelect,
    orderBy: { name: "asc" },
  });
}
export const getAllUsers = cache(allUsers);

async function allCommitteeMembers() {
  return await prisma.user.findMany({
    where: { role: { notIn: [Role.SUPER_ADMIN, Role.APPLICANT] } },
    select: userDataSelect,
    orderBy: { name: "asc" },
  });
}
export const getAllCommitteeMembers = cache(allCommitteeMembers);

async function allCommitteeMembersWithoutLeaders() {
  return await prisma.user.findMany({
    where: {
      role: {
        notIn: [
          Role.SUPER_ADMIN,
          Role.APPLICANT,
          Role.CHAIRMAN_BC,
          Role.CHAIRMAN_PPC,
          Role.REGISTRAR,
        ],
      },
    },
    select: userDataSelect,
    orderBy: { name: "asc" },
  });
}
export const getAllCommitteeMembersWithoutLeaders = cache(
  allCommitteeMembersWithoutLeaders,
);

async function allRoleBasedUsers(role: Role) {
  return await prisma.user.findMany({
    where: { role, AND: { role: { not: Role.SUPER_ADMIN } } },
  });
}

export const getAllRoleBasedUsers = cache(allRoleBasedUsers);

async function userById(id: string) {
  return await prisma.user.findFirst({ where: { id }, select: userDataSelect });
}
export const getUserById = cache(userById);

export async function upsertUser(
  input: SignUpSchema,
): Promise<string | UserData> {
  const { email, name, role, username, id } = signUpSchema.parse(input);
  // apply auth
  let _username = username || slugify(name);
  const password = DEFAULT_PASSWORD;
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const existingUserName = await prisma.user.findFirst({
    where: {
      username: {
        equals: _username,
        mode: "insensitive",
      },
    },
  });
  if (existingUserName) {
    if (!id) {
      _username = slugify(username + role);
    } else {
      return "Username is already taken, please select another";
    }
  }
  const existingEmail = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });
  if (existingEmail && !id) {
    return "Email is already taken or has been used to register before.";
  }

  return await prisma.user.upsert({
    where: { email },
    create: { email, name, passwordHash, role, username: _username },
    update: { email, name, role, username: _username },
    select: userDataSelect,
  });
}
