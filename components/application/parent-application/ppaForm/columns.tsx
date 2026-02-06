/* eslint-disable react-hooks/rules-of-hooks */
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
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
import { DotIcon, DropletsIcon, Edit3Icon, LightbulbIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { DataTableColumnHeader } from "../../../data-table/data-table-column-header";
import CommandItemApplicant from "../application/applicant/command-item-applicant";
import ButtonAddEditPpaForm1 from "./button-add-edit-ppa-form1";

export const usePpaForm1Columns: ColumnDef<ParentApplicationData>[] = [
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
    accessorKey: "application.type",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Application" />;
    },
    cell({ row }) {
      const {
        application: { status, type, year, applicationNo },
      } = row.original;
      const { title: applicationType } = applicationTypes[type];
      const { title: applicationStatus, variant: applicationVariant } =
        applicationStatuses[status];
      return (
        <div className="flex flex-col items-center">
          <div>{applicationType}</div>
          <div className="text-xs text-muted-foreground">
            {getApplicationNumber(applicationNo, year, type)}
          </div>
          <Badge variant={applicationVariant} className="mt-1.5">
            {applicationStatus}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "landUse.landUseType",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Land use" />;
    },
    cell({ row }) {
      const {
        landUse: { acreage, landUseType },
        site,
      } = row.original;
      const { title } = landUseTypes[landUseType];
      return (
        <div>
          <div>{title}</div>
          <div>{acreage}</div>
          {!!site && (
            <div className="flex gap-0.5">
              {site.hasElectricity && (
                <LightbulbIcon className="fill-amber-300 text-amber-500" />
              )}
              {site.hasNationalWater && (
                <DropletsIcon className="fill-cyan-300 text-cyan-500" />
              )}
            </div>
          )}
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
          title="Nature of interest"
          className="text-center w-full flex justify-center "
        />
      );
    },
    cell({ row }) {
      const { natureOfInterest } = row.original;
      const { title } = naturesOfInterestInLand[natureOfInterest];
      return <div className="text-center w-full  ">{title}</div>;
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
          <div>{district}</div>
          <div>{street}</div>
          {!!parcel && (
            <div className="flex items-center text-xs text-muted-foreground">
              Plot {parcel.plotNumber} <DotIcon /> Block {parcel.blockNumber}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "application.createdAt",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Date created on" />;
    },
    cell({ row }) {
      const {
        application: { createdAt },
      } = row.original;

      return <span className="text-wrap">{formatDate(createdAt, "PPPp")}</span>;
    },
  },
  {
    id: "actions",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Actions" />;
    },
    cell({ row }) {
      const [isPending, startTransition] = useTransition();
      const { getNavigationLinkWithPathnameWithoutUpdate } =
        useCustomSearchParams();
      const url = getNavigationLinkWithPathnameWithoutUpdate(
        `/admin/registration/ppa-form${row.original.id}`,
      );
      return (
        <div className="flex gap-2 items-center">
          <ButtonAddEditPpaForm1
            size={"icon-sm"}
            variant={"outline"}
            parentApplication={row.original}
          >
            <Edit3Icon />
          </ButtonAddEditPpaForm1>

          <Link
            href={url}
            className={buttonVariants({ size: "sm" })}
            onClick={() => startTransition(() => {})}
          >
            {isPending && <Spinner className="inline" />}
            View
          </Link>
        </div>
      );
    },
  },
];
