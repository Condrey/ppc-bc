"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Committee } from "@/lib/generated/prisma/enums";
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
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        title={meeting ? "Update meeting" : "Create a meeting"}
        {...props}
        onClick={() => setOpen(true)}
      />
      <FormAddEditMeeting
        committee={committee}
        meeting={meeting}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
