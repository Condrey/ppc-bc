"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { ApplicantData } from "@/lib/types";
import { useState } from "react";
import FormAddEditApplicant from "./form-add-edit-applicant";

interface Props extends ButtonProps {
  applicant?: ApplicantData;
}
export default function ButtonAddEditApplicant({ applicant, ...props }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        title={applicant ? "Update applicant" : "Create a applicant"}
        {...props}
        onClick={() => setOpen(true)}
      />
      <FormAddEditApplicant
        applicant={applicant}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
