"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { allApplicationTypes, applicationTypes } from "@/lib/enums";
import { ApplicationType } from "@/lib/generated/prisma/enums";
import { BuildingApplicationData, ParentApplicationData } from "@/lib/types";
import { useState } from "react";
import FormAddEditPpaForm1BuildingApplication from "./form-add-edit-ppa-form1-building-application";
import FormAddEditPpaForm1LandApplication from "./form-add-edit-ppa-form1-land-application";

interface Props extends ButtonProps {
  parentApplication?: ParentApplicationData;
}
export default function ButtonAddEditPpaForm1({
  parentApplication,
  ...props
}: Props) {
  const [openLandApplication, setOpenLandApplication] = useState(false);
  const [openBuildingApplication, setOpenBuildingApplication] = useState(false);

  return (
    <>
      {!!parentApplication &&
      parentApplication.application.type === ApplicationType.LAND ? (
        <Button
          title={"Update ppa Form1 for land application"}
          {...props}
          onClick={() => setOpenLandApplication(true)}
        />
      ) : !!parentApplication &&
        parentApplication.application.type === ApplicationType.BUILDING ? (
        <Button
          title={"Update ppa Form1 for building application"}
          {...props}
          onClick={() => setOpenBuildingApplication(true)}
        />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button title={"Choose application"} {...props} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Application type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allApplicationTypes.map((at) => {
                const { icon: Icon, title } = applicationTypes[at];
                function handleClickEvent() {
                  if (at === ApplicationType.LAND) {
                    setOpenLandApplication(true);
                  } else if (at === ApplicationType.BUILDING) {
                    setOpenBuildingApplication(true);
                  }
                }
                return (
                  <DropdownMenuItem key={at} onClick={handleClickEvent}>
                    <Icon />
                    {title}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <FormAddEditPpaForm1LandApplication
        landApplication={parentApplication}
        open={openLandApplication}
        onOpenChange={setOpenLandApplication}
      />
      <FormAddEditPpaForm1BuildingApplication
        buildingApplication={parentApplication as BuildingApplicationData}
        open={openBuildingApplication}
        onOpenChange={setOpenBuildingApplication}
      />
    </>
  );
}
