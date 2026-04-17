import { DataTable } from "@/components/data-table/data-table";
import { TypographyH4 } from "@/components/headings";
import { ComprehensiveUserAppealData } from "@/lib/types";
import { Fragment } from "react";
import { useComprehensiveUserAppealsColumns } from "./columns-appeals";

interface Props {
  appeals: ComprehensiveUserAppealData[];
}
export default function MyAppeals({ appeals }: Props) {
  const title = `My submitted appeals`;
  return (
    <Fragment>
      {!appeals.length ? null : (
        <DataTable
          data={appeals}
          columns={useComprehensiveUserAppealsColumns}
          tableHeaderSection={
            <TypographyH4 text={title} className="text-success" />
          }
          filterColumn={{ id: "meeting_happeningOn", label: "start date" }}
          className="w-full"
        ></DataTable>
      )}
    </Fragment>
  );
}
