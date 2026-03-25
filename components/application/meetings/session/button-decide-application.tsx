"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { applicationStatuses, myPrivileges } from "@/lib/enums";
import { Application } from "@/lib/generated/prisma/browser";
import { ApplicationStatus, Role } from "@/lib/generated/prisma/enums";
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
  const { user } = useSession();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.PHYSICAL_PLANNER);
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
      {isAuthorized && (
        <LoadingButton
          loading={isPending}
          title={`${verb} application`}
          {...props}
          onClick={handleClick}
        />
      )}
    </>
  );
}
