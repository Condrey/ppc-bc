"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { LandApplicationData } from "@/lib/types";
import { useState } from "react";
import FormAddEditPpaForm1 from "./form-add-edit-ppa-form1";

interface Props extends ButtonProps {
  landApplication?: LandApplicationData;
}
export default function ButtonAddEditPpaForm1({
  landApplication,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        title={landApplication ? "Update ppaForm1" : "Create a ppaForm1"}
        {...props}
        onClick={() => setOpen(true)}
      />
      <FormAddEditPpaForm1
        landApplication={landApplication}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
