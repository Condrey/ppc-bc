import { buttonVariants } from "@/components/ui/button";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";

import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  applicationStatuses,
  applicationTypes,
  landUseTypes,
  naturesOfInterestInLand,
} from "@/lib/enums";
import {
  ApplicationType,
  FeeAssessmentType,
} from "@/lib/generated/prisma/enums";
import { ParentApplicationData } from "@/lib/types";
import { cn, formatCurrency, getApplicationNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import {
  CheckIcon,
  CircleIcon,
  DotIcon,
  DropletsIcon,
  LightbulbIcon,
} from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { DataTableColumnHeader } from "../../../data-table/data-table-column-header";
import ButtonAddInspection from "./button-add-inspection";

export const usePpcInspectionsColumns: ColumnDef<ParentApplicationData>[] = [
  {
    id: "index",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="s/n" />;
    },
    cell({ row }) {
      const {
        application: { inspections },
      } = row.original;
      const neverInspected = !inspections.length;
      return (
        <div>
          <CircleIcon
            className={cn(
              "inline-flex size-4",
              neverInspected
                ? "text-destructive fill-destructive"
                : "text-success fill-success",
            )}
          />
          <span>{row.index + 1}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "application.applicant.name",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Applicant" />;
    },
    cell({ row }) {
      const {
        application: {
          applicant: { name, contact },
        },
      } = row.original;
      return (
        <div>
          <div>{name}</div>
          <div className="text-xs text-muted-foreground">{contact}</div>
        </div>
      );
    },
  },
  {
    id: "inspection-type",
    header({ column }) {
      return (
        <DataTableColumnHeader column={column} title="Inspection Status" />
      );
    },
    cell({ row }) {
      const {
        application: { inspections, status },
      } = row.original;
      const neverInspected = !inspections.length;
      const { title, variant } = applicationStatuses[status];
      return (
        <Badge
          variant={
            // neverInspected ? "destructive" : variant
            "secondary"
          }
          className="font-bold"
        >
          {neverInspected
            ? "Pending"
            : status === "APPROVED"
              ? "Inspected"
              : title}
        </Badge>
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
      const { title: applicationStatus, variant } = applicationStatuses[status];
      return (
        <div className="">
          <Badge variant={variant}>{applicationStatus}</Badge>
          <div>{applicationType}</div>
          <div className="text-xs text-muted-foreground">
            {getApplicationNumber(applicationNo, year, type)}
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "application.feeAssessments",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Application Fee" />;
    },
    cell({ row }) {
      const {
        application: { feeAssessments, type },
      } = row.original;
      // const fee = feeAssessments.find(
      //   (f) => f.assessmentType === FeeAssessmentType.LAND_APPLICATION,
      // );
      const isLandApplication = type === ApplicationType.LAND;
      const fees = feeAssessments.filter((f) =>
        isLandApplication
          ? f.assessmentType === FeeAssessmentType.LAND_APPLICATION
          : f.assessmentType === FeeAssessmentType.BUILDING_APPLICATION,
      );
      if (!fees.length) {
        return (
          <p className="text-wrap italic text-muted-foreground">
            <strong>
              {isLandApplication ? "Land" : "Building"} application
            </strong>{" "}
            fee has not been assigned yet.
          </p>
        );
      }
      const allPayments = fees.flatMap((f) => f.payments);
      const amountAssessed = fees.reduce(
        (amount, total) => amount + total.amountAssessed,
        0,
      );
      const payments = allPayments.reduce(
        (amount, total) => amount + total.amountPaid,
        0,
      );
      const balance = amountAssessed - payments;
      const { currency } = fees[0];
      return (
        <div>
          <div>
            <span className="text-muted-foreground italic">Paid: </span>
            <span
              className={cn(payments <= 0 ? "font-medium" : "text-success")}
            >
              {payments <= 0
                ? "Nothing"
                : formatCurrency(payments, currency, true)}
            </span>
          </div>
          {balance <= 0 ? (
            <div className="text-success font-bold">
              <CheckIcon className="inline" />
              Fully paid
            </div>
          ) : (
            <div>
              <span className="text-muted-foreground italic">bal: </span>
              <span className="text-destructive">
                {formatCurrency(balance, currency, true)}
              </span>
            </div>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "natureOfInterest",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Land use" />;
    },
    cell({ row }) {
      const {
        natureOfInterest,
        landUse: { acreage, landUseType },
        site,
      } = row.original;
      const { title: usePurpose } = landUseTypes[landUseType];
      const { title: landInterest } = naturesOfInterestInLand[natureOfInterest];

      return (
        <div>
          <div>{`${landInterest} for ${usePurpose}`}</div>
          <div className="text-muted-foreground">
            {acreage}{" "}
            {!!site && (
              <div className=" inline-flex gap-0.5 *:[&svg]:size-4">
                {site.hasElectricity && (
                  <LightbulbIcon className="fill-amber-300 text-amber-500" />
                )}
                {site.hasNationalWater && (
                  <DropletsIcon className="fill-cyan-300 text-cyan-500" />
                )}
              </div>
            )}
          </div>
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
      const {
        application: { inspections },
        applicationId,
      } = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isPending, startTransition] = useTransition();
      const neverInspected = !inspections.length;
      const { getNavigationLinkWithPathnameWithoutUpdate } =
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useCustomSearchParams();

      const url = getNavigationLinkWithPathnameWithoutUpdate(
        `/admin/inspections/ppc-inspections/${applicationId}`,
      );
      return (
        <div className="flex gap-2 items-center">
          {neverInspected ? (
            <ButtonAddInspection
              redirectUrl={url}
              applicationId={applicationId}
              size={"sm"}
            >
              Inspect
            </ButtonAddInspection>
          ) : (
            <Link
              href={url}
              onClick={() => startTransition(() => {})}
              className={buttonVariants({ size: "sm" })}
            >
              {isPending && <Spinner className="inline" />} View
            </Link>
          )}
        </div>
      );
    },
  },
];
