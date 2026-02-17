"use client";

import { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { applicationStatuses } from "@/lib/enums";
import { Application } from "@/lib/generated/prisma/browser";
import { ApplicationStatus } from "@/lib/generated/prisma/enums";
import { useDecideApplicationMutation } from "../mutations";

interface Props extends ButtonProps {
  application: Application;
  decision: ApplicationStatus;
}
export default function ButtonDecideApplication({
  application,
  decision,
  ...props
}: Props) {
  const { mutate, isPending } = useDecideApplicationMutation();
  const { verb } = applicationStatuses[decision];

  function handleClick() {
    mutate(
      { application, decision },
      {
        onSuccess: () => {},
      },
    );
  }
  return (
    <>
      <LoadingButton
        loading={isPending}
        title={`${verb} application`}
        {...props}
        onClick={handleClick}
      />
    </>
  );
}
