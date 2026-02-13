"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";

import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  applicationStatuses,
  applicationTypes,
  landUseTypes,
  naturesOfInterestInLand,
} from "@/lib/enums";
import { ParentApplicationData } from "@/lib/types";
import { getApplicationNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { DotIcon, Edit3Icon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { DataTableColumnHeader } from "../../data-table/data-table-column-header";
import CommandItemApplicant from "../parent-application/application/applicant/command-item-applicant";
import ButtonAddEditParcel from "./button-add-edit-parcel";

export const useParcelsColumns: ColumnDef<ParentApplicationData>[] = [
  {
    id: "index",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="s/n" />;
    },
    cell({ row }) {
      return <span>{row.index + 1}</span>;
    },
  },
  {
    accessorKey: "application.applicant.name",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Applicant" />;
    },
    cell({ row }) {
      const {
        application: { applicant },
      } = row.original;
      return (
        <CommandItemApplicant
          applicant={applicant}
          isChecked={false}
          avatarSize="45px"
        />
      );
    },
  },
  {
    accessorKey: "parcel.parcelNumber",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Parcel Number" />;
    },
    cell({ row }) {
      const { parcel } = row.original;
      if (!parcel)
        return <strong className="text-destructive">No parcel created</strong>;
      return (
        <>
          {parcel.parcelNumber ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"link"}
                  className="font-sans slashed-zero"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(parcel.parcelNumber!)
                      .then(() => {
                        toast.info(
                          `Parcel number ${parcel.parcelNumber} copied to clipboard`,
                        );
                      })
                      .catch((err) => {
                        console.error("Failed to copy:", err);
                        toast.error(
                          `Could not copy parcel number ${parcel.parcelNumber}`,
                        );
                      });
                  }}
                >
                  {parcel.parcelNumber}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Click to copy parcel number</TooltipContent>
            </Tooltip>
          ) : (
            <Badge variant={"destructive"}>Not added</Badge>
          )}
        </>
      );
    },
  },

  {
    accessorKey: "application.type",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Application" />;
    },
    cell({ row }) {
      const {
        application: { type, year, applicationNo, status },
      } = row.original;
      const { title: applicationType } = applicationTypes[type];
      const { title: applicationStatus } = applicationStatuses[status];
      return (
        <div className="">
          <div>{applicationType}</div>
          <div className="text-xs text-muted-foreground">
            {getApplicationNumber(applicationNo, year, type)}
          </div>
          <Badge variant={"outline"}>{applicationStatus}</Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "natureOfInterest",
    header({ column }) {
      return (
        <DataTableColumnHeader
          column={column}
          title="Land use/ Land application type"
        />
      );
    },
    cell({ row }) {
      const {
        natureOfInterest,
        landUse: { landUseType },
        application: { landApplication },
      } = row.original;
      const isLAndApplication = !!landApplication;
      const { title: usePurpose } = landUseTypes[landUseType];
      const { title: landInterest } = naturesOfInterestInLand[natureOfInterest];

      return (
        <div className="max-w-36 *:text-wrap">
          <div>
            {isLAndApplication ? (
              <>Applying for {landInterest} certificate</>
            ) : (
              <>{`Building on a ${landInterest} land for ${usePurpose} use`}</>
            )}
          </div>
          <div className="text-muted-foreground"></div>
        </div>
      );
    },
  },

  {
    accessorKey: "address",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Address" />;
    },
    cell({ row }) {
      const {
        parcel,
        address: { district, street },
      } = row.original;

      return (
        <div>
          <div>
            {street && <span className="italic">{street},</span>}
            {district}
          </div>
          {!!parcel && (
            <>
              <div className="flex items-center text-xs text-muted-foreground">
                Plot {parcel.plotNumber} <DotIcon /> Block {parcel.blockNumber}
              </div>
              {parcel.areaSqMeters && <div>{parcel.areaSqMeters}sq meters</div>}
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "parcel.geometry",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Geometry" />;
    },
    cell({ row }) {
      const { parcel } = row.original;
      if (!parcel)
        return <strong className="text-destructive">No parcel created</strong>;
      return (
        <div className="max-w-36 *:text-wrap">
          {parcel.geometry ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"link"}
                  onClick={() => {
                    navigator.clipboard
                      .writeText(JSON.stringify(parcel.geometry, null, 2))
                      .then(() => {
                        toast.info(`Geometry copied to clipboard`);
                      })
                      .catch((err) => {
                        console.error("Failed to copy:", err);
                        toast.error(`Could not copy geometry`);
                      });
                  }}
                >
                  Copy
                </Button>
              </TooltipTrigger>
              <TooltipContent>Click to copy Geometry</TooltipContent>
            </Tooltip>
          ) : (
            <Badge variant={"destructive"}>Not added</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "application.createdAt",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Applied on" />;
    },
    cell({ row }) {
      const {
        application: { createdAt },
      } = row.original;

      return <span>{formatDate(createdAt, "PP")}</span>;
    },
  },
  {
    id: "actions",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Actions" />;
    },
    cell({ row }) {
      const { applicationId } = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isPending, startTransition] = useTransition();
      const { getNavigationLinkWithPathnameWithoutUpdate } =
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useCustomSearchParams();

      const url = getNavigationLinkWithPathnameWithoutUpdate(
        `/admin/plotting/${applicationId}`,
      );
      return (
        <div className="flex gap-2 items-center">
          <ButtonAddEditParcel
            parentApplication={row.original}
            size={"icon-sm"}
          >
            <Edit3Icon />
          </ButtonAddEditParcel>
          <Link
            href={url}
            onClick={() => startTransition(() => {})}
            className={buttonVariants({ size: "sm" })}
          >
            {isPending && <Spinner className="inline" />} View
          </Link>
        </div>
      );
    },
  },
];
