"use server";

import { validateRequest } from "@/app/(auth)/auth";
import { DEFAULT_PASSWORD } from "@/lib/constants";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import {
  comprehensiveUserDataSelect,
  UserData,
  userDataSelect,
} from "@/lib/types";
import { slugify } from "@/lib/utils";
import {
  signUpSchema,
  SignUpSchema,
  updatePasswordSchema,
  UpdatePasswordSchema,
} from "@/lib/validation";
import { hash, verify } from "@node-rs/argon2";
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
    select: userDataSelect,
    orderBy: { name: "asc" },
  });
}

export const getAllRoleBasedUsers = cache(allRoleBasedUsers);

async function userById(id: string) {
  return await prisma.user.findFirst({
    where: { id },
    select: comprehensiveUserDataSelect,
  });
}
export const getUserById = cache(userById);

async function userByUsername(username: string) {
  return await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: comprehensiveUserDataSelect,
  });
}
export const getUserByUsername = cache(userByUsername);

export async function upsertUser(
  input: SignUpSchema,
): Promise<string | UserData> {
  const { email, name, role, username, id, ppcMembership } =
    signUpSchema.parse(input);

  const { user } = await validateRequest();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.IT_OFFICER);
  if (!isAuthorized) return "You are not authorized to add or edit users";
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
    }
    // else {
    //   return "Username is already taken, please select another";
    // }
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
    create: {
      email,
      name,
      passwordHash,
      role,
      username: _username,
      ppcMembership,
    },
    update: { email, name, role, username: _username, ppcMembership },
    select: userDataSelect,
  });
}

export async function updatePassword({
  input,
  userId: _userId,
}: {
  input: UpdatePasswordSchema;
  userId?: string;
}): Promise<{ error: string | null; message: string | null }> {
  const { user } = await validateRequest();
  const userId =
    user && myPrivileges[user.role].includes(Role.IT_OFFICER)
      ? _userId || user.id
      : user?.id || _userId;
  const { currentPassword, newPassword, repeatPassword } =
    updatePasswordSchema.parse(input);

  const existingUser = await prisma.user.findFirst({ where: { id: userId } });
  if (newPassword !== repeatPassword) {
    return { error: "Password mismatch ", message: null };
  }
  if (newPassword === currentPassword) {
    return { error: "Use a new password not used before.", message: null };
  }
  if (!existingUser) return { error: "Unknown user", message: null };
  const validPassword = await verify(
    existingUser.passwordHash!,
    currentPassword,
    {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    },
  );
  if (!validPassword) {
    console.error("Wrong password input, ", currentPassword);
    return {
      error: "Incorrect current password.",
      message: null,
    };
  }

  const passwordHash = await hash(repeatPassword, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  await prisma.user.update({
    where: { id: _userId },
    data: {
      passwordHash,
    },
  });

  return { error: null, message: "successfully updated the password." };
}
