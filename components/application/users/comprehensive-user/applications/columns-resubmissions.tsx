"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ComprehensiveUserResubmissionData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const useComprehensiveUserResubmissionsColumns: ColumnDef<ComprehensiveUserResubmissionData>[] =
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
      accessorKey: "carriedOn",
      header({ column }) {
        return <DataTableColumnHeader column={column} title="Inspection" />;
      },
      cell({ row }) {
        const {} = row.original;

        return <div></div>;
      },
    },
  ];
