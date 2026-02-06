import { applicationTypes } from "@/lib/enums";
import {
  ApplicationType,
  FeeAssessmentType,
} from "@/lib/generated/prisma/enums";
import { ParentApplicationData } from "@/lib/types";
import { cn, formatCurrency, getApplicationNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { CheckIcon } from "lucide-react";
import { DataTableColumnHeader } from "../../../data-table/data-table-column-header";
import DropDownMenuFeesAssessment from "./drop-down-menu-fees-assessment";

export const usePaymentAssessmentsColumns: ColumnDef<ParentApplicationData>[] =
  [
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
      accessorKey: "application.applicationNo",
      header({ column }) {
        return (
          <DataTableColumnHeader column={column} title="Application Number" />
        );
      },
      cell({ row }) {
        const {
          application: { type, year, applicationNo },
        } = row.original;

        const { title: applicationType } = applicationTypes[type];

        return (
          <div className="">
            <div>{applicationType}</div>
            <div className="text-xs text-muted-foreground">
              {getApplicationNumber(applicationNo, year, type)}
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "application.feeAssessments.application",
      header({ column }) {
        return (
          <DataTableColumnHeader column={column} title="Application Fee(s)" />
        );
      },
      cell({ row }) {
        const {
          application: { feeAssessments, type },
        } = row.original;
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
      accessorKey: "application.feeAssessments.inspection",
      header({ column }) {
        return (
          <DataTableColumnHeader column={column} title="Inspection Fee(s)" />
        );
      },
      cell({ row }) {
        const {
          application: { feeAssessments },
        } = row.original;

        const fees = feeAssessments.filter(
          (f) => f.assessmentType === FeeAssessmentType.INSPECTION,
        );

        if (!fees.length) {
          return (
            <p className="text-wrap italic text-muted-foreground">
              No <strong>inspection</strong> fee charged.
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
      accessorKey: "application.feeAssessments.penalty",
      header({ column }) {
        return (
          <DataTableColumnHeader column={column} title="Penalty Charge(s)" />
        );
      },
      cell({ row }) {
        const {
          application: { feeAssessments },
        } = row.original;

        const fees = feeAssessments.filter(
          (f) => f.assessmentType === FeeAssessmentType.PENALTY,
        );

        if (!fees.length) {
          return (
            <p className="text-wrap italic text-muted-foreground">
              No <strong>penalty</strong> fee charged.
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
      accessorKey: "application.createdAt",
      header({ column }) {
        return <DataTableColumnHeader column={column} title="Applied on" />;
      },
      cell({ row }) {
        const {
          application: { createdAt },
        } = row.original;

        return (
          <span className="text-muted-foreground">
            {formatDate(createdAt, "PPp")}
          </span>
        );
      },
    },
    {
      id: "actions",
      header({ column }) {
        return <DataTableColumnHeader column={column} title="Actions" />;
      },
      cell({ row }) {
        return <DropDownMenuFeesAssessment parentApplication={row.original} />;
      },
    },
  ];
