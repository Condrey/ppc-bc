"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { myPrivileges } from "@/lib/enums";
import { Committee, Role } from "@/lib/generated/prisma/enums";
import { MeetingData } from "@/lib/types";
import { useState } from "react";
import FormAddEditMeeting from "./form-add-edit-meeting";

interface Props extends ButtonProps {
  meeting?: MeetingData;
  committee: Committee;
}
export default function ButtonAddEditMeeting({
  meeting,
  committee,
  ...props
}: Props) {
  const { user } = useSession();
  const isAuthorized = user && myPrivileges[user.role].includes(Role.REGISTRAR);

  const [open, setOpen] = useState(false);

  return (
    <>
      {isAuthorized && (
        <Button
          title={meeting ? "Update meeting" : "Create a meeting"}
          {...props}
          onClick={() => setOpen(true)}
        />
      )}
      <FormAddEditMeeting
        committee={committee}
        meeting={meeting}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
