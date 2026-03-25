"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { myPrivileges } from "@/lib/enums";
import { Application } from "@/lib/generated/prisma/client";
import { FeeAssessmentType, Role } from "@/lib/generated/prisma/enums";
import { FeeAssessmentData } from "@/lib/types";
import { useState } from "react";
import FormAddEditFeeAssessment from "./form-add-edit-fee-assessment";

interface Props extends ButtonProps {
  feeAssessment?: FeeAssessmentData;
  assessmentType: FeeAssessmentType;
  application: Application;
}
export default function ButtonAddEditFeeAssessment({
  feeAssessment,
  assessmentType,
  application,
  ...props
}: Props) {
  const { user } = useSession();
  const isAuthorized = user && myPrivileges[user.role].includes(Role.REGISTRAR);

  const [open, setOpen] = useState(false);

  return (
    <>
      {isAuthorized && (
        <Button
          title={
            feeAssessment ? "Update feeAssessment" : "Create a feeAssessment"
          }
          {...props}
          onClick={() => setOpen(true)}
        />
      )}
      <FormAddEditFeeAssessment
        application={application}
        feeAssessment={feeAssessment}
        assessmentType={assessmentType}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
