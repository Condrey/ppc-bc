"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { ParentApplicationData } from "@/lib/types";
import { useState } from "react";
import FormAddEditParcel from "./form-add-edit-parcel";

interface Props extends ButtonProps {
  parentApplication: ParentApplicationData;
}
export default function ButtonAddEditParcel({
  parentApplication,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        title={"Update parcel"}
        {...props}
        onClick={() => setOpen(true)}
      />
      <FormAddEditParcel
        parentApplication={parentApplication}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
