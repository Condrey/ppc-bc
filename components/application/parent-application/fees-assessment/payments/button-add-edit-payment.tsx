"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { PaymentData } from "@/lib/types";
import { useState } from "react";
import FormAddEditPayment from "./form-add-edit-payment";

interface Props extends ButtonProps {
  payment?: PaymentData;
  feeAssessmentId: string;
}
export default function ButtonAddEditPayment({
  payment,
  feeAssessmentId,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        title={payment ? "Update payment" : "Create a payment"}
        {...props}
        onClick={() => setOpen(true)}
      />
      <FormAddEditPayment
        payment={payment}
        feeAssessmentId={feeAssessmentId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
