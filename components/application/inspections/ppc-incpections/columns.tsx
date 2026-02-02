import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";

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
import { LandApplicationData } from "@/lib/types";
import { cn, formatCurrency, getApplicationNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import {
  CheckIcon,
  DotIcon,
  DropletsIcon,
  LightbulbIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { DataTableColumnHeader } from "../../../data-table/data-table-column-header";
import CommandItemApplicant from "../../land-application/application/applicant/command-item-applicant";
import ButtonAddEditPayment from "../../land-application/fees-assessment/payments/button-add-edit-payment";

export const usePpcInspectionsColumns: ColumnDef<LandApplicationData>[] = [
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
    accessorKey: "application.feeAssessments",
    header({ column }) {
      return (
        <DataTableColumnHeader column={column} title="Land application Fee" />
      );
    },
    cell({ row }) {
      const {
        application: { feeAssessments },
      } = row.original;
      const fee = feeAssessments.find(
        (f) => f.assessmentType === FeeAssessmentType.LAND_APPLICATION,
      );
      if (!fee) {
        return (
          <p className="text-wrap italic text-muted-foreground">
            Land Application fee has not been assigned yet.
          </p>
        );
      }
      const { currency, amountAssessed, payments: allPayments } = fee;
      const payments = allPayments.reduce(
        (amount, total) => amount + total.amountPaid,
        0,
      );
      const balance = amountAssessed - payments;
      return (
        <div>
          <div> {formatCurrency(amountAssessed, currency, true)}</div>
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

      return <span>{formatDate(createdAt, "PPPp")}</span>;
    },
  },
  {
    id: "actions",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Actions" />;
    },
    cell({ row }) {
      const { getNavigationLinkWithPathnameWithoutUpdate } =
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useCustomSearchParams();
      const url = getNavigationLinkWithPathnameWithoutUpdate(
        `/admin/registration/ppa-form/${row.original.id}`,
      );
      const {
        application: { feeAssessments, type: applicationType },
      } = row.original;
      const typeOfFee =
        applicationType === ApplicationType.BUILDING
          ? FeeAssessmentType.BUILDING_APPLICATION
          : applicationType === ApplicationType.LAND
            ? FeeAssessmentType.LAND_APPLICATION
            : FeeAssessmentType.INSPECTION;
      const landApplicationFee = feeAssessments.find(
        (f) => f.assessmentType == typeOfFee,
      );
      const fee = feeAssessments.find(
        (f) => f.assessmentType === FeeAssessmentType.LAND_APPLICATION,
      );

      const payments =
        fee?.payments.reduce((amount, total) => amount + total.amountPaid, 0) ||
        0;
      const balance = (fee?.amountAssessed || 0) - payments;
      return (
        <div className="flex gap-2 items-center">
          {!!landApplicationFee && balance > 0 && (
            <ButtonAddEditPayment feeAssessmentId={landApplicationFee.id}>
              <PlusIcon /> Pay
            </ButtonAddEditPayment>
          )}
          <Link href={url} className={buttonVariants({ size: "sm" })}>
            View
          </Link>
        </div>
      );
    },
  },
];
