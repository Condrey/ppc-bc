"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { applicationDecisions, applicationStatuses } from "@/lib/enums";
import { ComprehensiveUserInspectionData } from "@/lib/types";
import { getApplicationNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";

export const useComprehensiveUserInspectionColumns: ColumnDef<ComprehensiveUserInspectionData>[] =
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
      accessorKey: "application",
      header({ column }) {
        return <DataTableColumnHeader column={column} title="Application" />;
      },
      cell({ row }) {
        const {
          application: { applicationNo, year, type, status },
        } = row.original;
        const applicationNumber = getApplicationNumber(
          applicationNo,
          year,
          type,
        );
        const { title: applicationStatus, variant } =
          applicationStatuses[status];
        return (
          <div>
            <div>{applicationNumber}</div>
            <Badge variant={variant}>{applicationStatus}</Badge>
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
            <div>{contact}</div>{" "}
          </div>
        );
      },
    },
    {
      accessorKey: "carriedOn",
      header({ column }) {
        return <DataTableColumnHeader column={column} title="Inspection" />;
      },
      cell({ row }) {
        const { carriedOn, decision } = row.original;
        const { title: applicationDecision } = applicationDecisions[decision];
        return (
          <div>
            <div>{formatDate(carriedOn, "PPPP")}</div>
            <div className="capitalize text-xs text-muted-foreground">
              application {applicationDecision}
            </div>
          </div>
        );
      },
    },
  ];
