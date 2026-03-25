"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
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
  const { user } = useSession();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.PHYSICAL_PLANNER);
  const [open, setOpen] = useState(false);

  return (
    <>
      {isAuthorized && (
        <Button
          title={"Update parcel"}
          {...props}
          onClick={() => setOpen(true)}
        />
      )}
      <FormAddEditParcel
        parentApplication={parentApplication}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
