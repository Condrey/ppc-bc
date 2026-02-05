"use client";

import { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { useAddInspectionMutation } from "./mutations";

interface Props extends ButtonProps {
  redirectUrl?: string;
  applicationId: string;
}
export default function ButtonAddInspection({
  redirectUrl,
  applicationId,
  ...props
}: Props) {
  const { mutate, isPending } = useAddInspectionMutation();
  function onButtonClick() {
    mutate({ applicationId, redirectUrl });
  }

  return (
    <>
      <LoadingButton
        loading={isPending}
        title={"Start inspection"}
        {...props}
        onClick={onButtonClick}
      />
    </>
  );
}
