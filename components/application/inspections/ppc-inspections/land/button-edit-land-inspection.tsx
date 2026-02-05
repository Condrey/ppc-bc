"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { myPrivileges, roles } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import { InspectionData, InspectionLandApplicationData } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";
import FormAddEditLandInspection from "./form-edit-land-inspection";

interface Props extends ButtonProps {
  landApplication: InspectionLandApplicationData;
  inspection: InspectionData;
}
export default function ButtonEditLandInspection({
  landApplication,
  inspection,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);
  const { user } = useSession();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.SURVEYOR);
  const { title } = roles[user?.role || Role.APPLICANT];
  function onButtonClicked() {
    if (!isAuthorized) {
      toast.error("Unauthorized", {
        description: `${title} ${user?.name || "_"}, your are not authorized to perform this action, but the surveyor, and ranks higher than it.`,
      });
    } else {
      setOpen(true);
    }
  }
  return (
    <>
      <Button
        title={"Update inspection"}
        {...props}
        onClick={onButtonClicked}
      />
      <FormAddEditLandInspection
        landApplication={landApplication}
        inspection={inspection}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
