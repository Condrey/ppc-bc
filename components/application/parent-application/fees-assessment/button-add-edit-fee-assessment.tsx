"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Application } from "@/lib/generated/prisma/client";
import { FeeAssessmentType } from "@/lib/generated/prisma/enums";
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
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        title={
          feeAssessment ? "Update feeAssessment" : "Create a feeAssessment"
        }
        {...props}
        onClick={() => setOpen(true)}
      />
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
