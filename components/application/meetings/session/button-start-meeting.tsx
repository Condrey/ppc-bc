"use client";

import { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { MeetingStatus } from "@/lib/generated/prisma/enums";
import { MeetingData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useStartMeetingMutation } from "../mutations";
import SheetMeetingSession from "./sheet-meeting-session";

interface Props extends ButtonProps {
  meeting: MeetingData;
}
export default function ButtonStartMeeting({ meeting, ...props }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useStartMeetingMutation();
  const meetingInProgress = meeting.status === MeetingStatus.IN_PROGRESS;

  function handleClick() {
    if (meetingInProgress) {
      setOpen(true);
    } else {
      mutate(meeting.id, {
        onSuccess: () => setOpen(true),
      });
    }
  }
  return (
    <>
      <LoadingButton
        loading={isPending}
        title={meetingInProgress ? "Resume meeting" : "Start meeting"}
        className={cn(meetingInProgress && "bg-success animate-pulse")}
        {...props}
        onClick={handleClick}
      />
      <SheetMeetingSession
        open={open}
        onOpenChange={setOpen}
        meeting={meeting}
      />
    </>
  );
}
