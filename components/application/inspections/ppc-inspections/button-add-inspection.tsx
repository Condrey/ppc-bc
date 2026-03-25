"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
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
  const { user } = useSession();
  const isAuthorized = user && myPrivileges[user.role].includes(Role.SURVEYOR);

  const { mutate, isPending } = useAddInspectionMutation();
  function onButtonClick() {
    mutate({ applicationId, redirectUrl });
  }

  return (
    <>
      {isAuthorized && (
        <LoadingButton
          loading={isPending}
          title={"Start inspection"}
          {...props}
          onClick={onButtonClick}
        />
      )}
    </>
  );
}
