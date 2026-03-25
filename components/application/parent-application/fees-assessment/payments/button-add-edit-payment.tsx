"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
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
  const { user } = useSession();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.PHYSICAL_PLANNER);
  const [open, setOpen] = useState(false);

  return (
    <>
      {isAuthorized && (
        <Button
          title={payment ? "Update payment" : "Create a payment"}
          {...props}
          onClick={() => setOpen(true)}
        />
      )}
      <FormAddEditPayment
        payment={payment}
        feeAssessmentId={feeAssessmentId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
