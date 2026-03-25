"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import { UserData } from "@/lib/types";
import { useState } from "react";
import FormAddEditUser from "./form-add-edit-user";

interface Props extends ButtonProps {
  user?: UserData;
  role?: Role;
}
export default function ButtonAddEditUser({
  user,
  role,
  type,
  ...props
}: Props) {
  const { user: sessionUser } = useSession();
  const isAuthorized =
    sessionUser && myPrivileges[sessionUser.role].includes(Role.IT_OFFICER);
  const [open, setOpen] = useState(false);

  return (
    <>
      {isAuthorized && (
        <Button
          type={type || "button"}
          title={user ? "Edit user" : "Create a new user."}
          {...props}
          onClick={() => setOpen(true)}
        />
      )}
      <FormAddEditUser
        open={open}
        onOpenChange={setOpen}
        role={role}
        user={user}
      />
    </>
  );
}
