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
import { Spinner } from "@/components/ui/spinner";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { allFeesAssessmentTypes, feesAssessmentTypes } from "@/lib/enums";
import {
  ApplicationType,
  FeeAssessmentType,
} from "@/lib/generated/prisma/enums";
import { ParentApplicationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MoveUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import ButtonAddEditFeeAssessment from "./button-add-edit-fee-assessment";

interface Props extends ButtonProps {
  parentApplication: ParentApplicationData;
  isADropDown?: boolean;
}

export default function DropDownMenuFeesAssessment({
  parentApplication,
  isADropDown = true,
  children,
  ...props
}: Props) {
  const { id, application } = parentApplication;
  const { type: applicationType } = application;
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const url = getNavigationLinkWithPathnameWithoutUpdate(
    `/admin/fees-assessments/fee/${applicationType}/${id}`,
  );
  const [isPending, startTransition] = useTransition();

  const isLandApplication = applicationType === ApplicationType.LAND;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...props}>
          {isPending && <Spinner className="inline" />}
          <div
            className={cn(
              "inline-flex items-center gap-1",
              isPending && "[&_svg]:hidden",
            )}
          >
            {children}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {isADropDown ? "Actions" : "Choose fee type"}
          </DropdownMenuLabel>
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
              <DropdownMenuItem key={f} className="w-full" asChild>
                <ButtonAddEditFeeAssessment
                  assessmentType={f}
                  application={application}
                  variant={"ghost"}
                  size={"sm"}
                  className="flex justify-start"
                >
                  <Icon /> Add {title} fee
                </ButtonAddEditFeeAssessment>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        {isADropDown && (
          <DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => startTransition(() => {})} asChild>
              <Link href={url}>
                {isPending ? (
                  <Spinner className="inline" />
                ) : (
                  <MoveUpRightIcon className="inline" />
                )}
                View application
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
