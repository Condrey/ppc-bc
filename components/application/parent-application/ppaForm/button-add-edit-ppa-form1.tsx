"use client";

import { useSession } from "@/app/(auth)/session-provider";
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
import {
  allApplicationTypes,
  applicationTypes,
  myPrivileges,
} from "@/lib/enums";
import { ApplicationType, Role } from "@/lib/generated/prisma/enums";
import { BuildingApplicationData, ParentApplicationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FormAddEditPpaForm1BuildingApplication from "./form-add-edit-ppa-form1-building-application";
import FormAddEditPpaForm1LandApplication from "./form-add-edit-ppa-form1-land-application";

interface Props extends ButtonProps {
  parentApplication?: ParentApplicationData;
}
export default function ButtonAddEditPpaForm1({
  parentApplication,
  className,
  ...props
}: Props) {
  const { user } = useSession();
  const isAuthorized = user && myPrivileges[user.role].includes(Role.REGISTRAR);

  const [openLandApplication, setOpenLandApplication] = useState(false);
  const [openBuildingApplication, setOpenBuildingApplication] = useState(false);

  return (
    <>
      {isAuthorized && (
        <>
          {!!parentApplication &&
          parentApplication.application.type === ApplicationType.LAND ? (
            <Button
              title={"Update ppa Form1 for land application"}
              className={cn("[&_svg]:inline", className)}
              {...props}
              onClick={() => setOpenLandApplication(true)}
            />
          ) : !!parentApplication &&
            parentApplication.application.type === ApplicationType.BUILDING ? (
            <Button
              title={"Update ppa Form1 for building application"}
              className={cn("[&_svg]:inline", className)}
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
        </>
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
