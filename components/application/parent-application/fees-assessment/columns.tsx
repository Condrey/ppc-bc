import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { applicationTypes, feesAssessmentTypes, roles } from "@/lib/enums";
import { FeeAssessmentData } from "@/lib/types";
import { cn, formatCurrency, getApplicationNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { CheckIcon, Edit2Icon, PlusIcon } from "lucide-react";
import ButtonAddEditFeeAssessment from "./button-add-edit-fee-assessment";
import ButtonAddEditPayment from "./payments/button-add-edit-payment";

export const useApplicationFeeAssessmentsColumns: ColumnDef<FeeAssessmentData>[] =
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
      accessorKey: "assessmentType",
      header({ column }) {
        return (
          <DataTableColumnHeader column={column} title="Assessment fee type" />
        );
      },
      cell({ row }) {
        const { assessmentType } = row.original;
        const { title, icon: Icon } = feesAssessmentTypes[assessmentType];
        return (
          <div>
            <div>
              <Icon className="inline mr-2 size-5" />
              {title + " fee"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "amountAssessed",
      header({ column }) {
        return (
          <DataTableColumnHeader column={column} title="Assessed amount" />
        );
      },
      cell({ row }) {
        const {
          amountAssessed,
          currency,
          payments: allPayments,
        } = row.original;

        const payments = allPayments.reduce(
          (amount, total) => amount + total.amountPaid,
          0,
        );
        const balance = amountAssessed - payments;

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
      accessorKey: "application.applicant.name",
      header({ column }) {
        return (
          <DataTableColumnHeader
            column={column}
            title="Applicant information"
          />
        );
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
          <DataTableColumnHeader
            column={column}
            title="Application information"
          />
        );
      },
      cell({ row }) {
        const {
          application: { applicationNo, year, type },
        } = row.original;
        const applicationNumber = getApplicationNumber(
          applicationNo,
          year,
          type,
        );
        const { title, icon: Icon } = applicationTypes[type];
        return (
          <div>
            <div>{applicationNumber}</div>
            <div className="text-xs text-muted-foreground">
              <Icon className="inline mr-2 size-4" />
              {title}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "assessedAt",
      header({ column }) {
        return (
          <DataTableColumnHeader column={column} title="Assessed by (at)" />
        );
      },
      cell({ row }) {
        const {
          assessedAt,
          assessedBy: { name, role },
        } = row.original;
        const { title } = roles[role];

        return (
          <div>
            <div>{formatDate(assessedAt, "PPp")}</div>
            <div className="text-xs text-muted-foreground">
              {name} - {title}
            </div>
          </div>
        );
      },
    },

    {
      id: "actions",
      header({ column }) {
        return <DataTableColumnHeader column={column} title="Actions" />;
      },
      cell({ row }) {
        const { application, assessmentType, id } = row.original;
        return (
          <div className="flex items-center gap-2">
            <ButtonAddEditFeeAssessment
              application={application}
              assessmentType={assessmentType}
              feeAssessment={row.original}
              size={"icon-sm"}
              variant={"outline"}
            >
              <Edit2Icon />
            </ButtonAddEditFeeAssessment>
            <ButtonAddEditPayment feeAssessmentId={id} size={"sm"}>
              <PlusIcon /> Pay
            </ButtonAddEditPayment>
          </div>
        );
      },
    },
  ];
