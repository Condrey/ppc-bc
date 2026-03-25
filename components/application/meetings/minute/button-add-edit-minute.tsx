"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { myPrivileges } from "@/lib/enums";
import { Meeting, Role } from "@/lib/generated/prisma/client";
import { MinuteData } from "@/lib/types";
import { useState } from "react";
import FormAddEditMinute from "./form-components/form-add-edit-minute";

interface Props extends ButtonProps {
  meeting: Meeting;
  minute?: MinuteData;
}
export default function ButtonAddEditMinute({
  minute,
  meeting,
  ...props
}: Props) {
  const { user } = useSession();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.PHYSICAL_PLANNER);
  const [open, setOpen] = useState(false);

  return (
    <>
      {isAuthorized && (
        <Button
          title={minute ? "Update minute" : "Start minuting"}
          {...props}
          onClick={() => setOpen(true)}
        />
      )}
      <FormAddEditMinute
        open={open}
        onOpenChange={setOpen}
        minute={minute}
        meeting={meeting}
      />
    </>
  );
}
