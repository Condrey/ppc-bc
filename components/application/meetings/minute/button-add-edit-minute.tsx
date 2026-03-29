"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { MeetingData, MinuteData } from "@/lib/types";
import { useState } from "react";
import FormAddEditMinute from "./form-components/form-add-edit-minute";

interface Props extends ButtonProps {
  meeting: MeetingData;
  minute?: MinuteData;
}
export default function ButtonAddEditMinute({
  meeting,
  minute,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        title={minute ? "Update minute " : "Start minuting"}
        disabled={!meeting}
        onClick={() => setOpen(true)}
        {...props}
      />
      <FormAddEditMinute
        open={open}
        meeting={meeting}
        minute={minute}
        onOpenChange={setOpen}
      />
    </>
  );
}
