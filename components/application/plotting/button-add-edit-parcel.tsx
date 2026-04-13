"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import { ApplicationData } from "@/lib/types";
import { useState } from "react";
import FormAddEditParcel from "./form-add-edit-parcel";

interface Props extends ButtonProps {
  application: ApplicationData;
}
export default function ButtonAddEditParcel({ application, ...props }: Props) {
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
        application={application}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
