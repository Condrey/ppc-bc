import { DataTable } from "@/components/data-table/data-table";
import { TypographyH4 } from "@/components/headings";
import { ComprehensiveUserResubmissionData } from "@/lib/types";
import { Fragment } from "react";
import { useComprehensiveUserResubmissionsColumns } from "./columns-resubmissions";

interface Props {
  resubmissions: ComprehensiveUserResubmissionData[];
}
export default function MyResubmissions({ resubmissions }: Props) {
  const title = `My submitted resubmissions`;
  return (
    <Fragment>
      {!resubmissions.length ? null : (
        <DataTable
          data={resubmissions}
          columns={useComprehensiveUserResubmissionsColumns}
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
