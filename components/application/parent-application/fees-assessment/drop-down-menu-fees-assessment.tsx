"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { allFeesAssessmentTypes, feesAssessmentTypes } from "@/lib/enums";
import {
  ApplicationType,
  FeeAssessmentType,
} from "@/lib/generated/prisma/enums";
import { ParentApplicationData } from "@/lib/types";
import { MoreVerticalIcon, MoveUpRightIcon } from "lucide-react";
import Link from "next/link";

export default function DropDownMenuFeesAssessment({
  parentApplication,
}: {
  parentApplication: ParentApplicationData;
}) {
  const {
    id,
    application: { type: applicationType },
  } = parentApplication;
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const url = getNavigationLinkWithPathnameWithoutUpdate(
    `/admin/fees-assessments/fee/${applicationType}/${id}`,
  );

  const isLandApplication = applicationType === ApplicationType.LAND;
  return (
    // <Link href={url} className={buttonVariants({ size: "sm" })}>
    //           View
    //         </Link>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <span className="sr-only">View more</span>
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allFeesAssessmentTypes.map((f) => {
            const { title, icon: Icon } = feesAssessmentTypes[f];
            if (
              isLandApplication &&
              f === FeeAssessmentType.BUILDING_APPLICATION
            ) {
              return null;
            } else if (
              !isLandApplication &&
              f === FeeAssessmentType.LAND_APPLICATION
            ) {
              return null;
            }
            return (
              <DropdownMenuItem key={f}>
                <Icon /> Add {title} fee
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          {/* <DropdownMenuLabel>Secondary action</DropdownMenuLabel> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={url}>
              <MoveUpRightIcon /> View application
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
