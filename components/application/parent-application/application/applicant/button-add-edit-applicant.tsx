"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import { ApplicantData } from "@/lib/types";
import { useState } from "react";
import FormAddEditApplicant from "./form-add-edit-applicant";

interface Props extends ButtonProps {
  applicant?: ApplicantData;
}
export default function ButtonAddEditApplicant({ applicant, ...props }: Props) {
  const { user } = useSession();
  const isAuthorized = user && myPrivileges[user.role].includes(Role.REGISTRAR);
  const [open, setOpen] = useState(false);

  return (
    <>
      {isAuthorized && (
        <Button
          title={applicant ? "Update applicant" : "Create a applicant"}
          {...props}
          onClick={() => setOpen(true)}
        />
      )}
      <FormAddEditApplicant
        applicant={applicant}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
