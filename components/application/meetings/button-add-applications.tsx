"use client";

import { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { useAddMoreMeetingApplicationsMutation } from "./mutations";

interface Props extends ButtonProps {
  meetingId: string;
}
export default function ButtonAddApplications({ meetingId, ...props }: Props) {
  const { mutate, isPending } = useAddMoreMeetingApplicationsMutation();

  function handleClick() {
    mutate(meetingId, {});
  }
  return <LoadingButton loading={isPending} onClick={handleClick} {...props} />;
}
