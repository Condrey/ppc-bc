import { DataTable } from "@/components/data-table/data-table";
import { TypographyH4 } from "@/components/headings";
import { EmptyContainer } from "@/components/query-container/empty-container";
import { ComprehensiveUserApplicationData } from "@/lib/types";
import { Fragment } from "react";
import { useComprehensiveUserApplicationsColumns } from "./columns-applications";

interface Props {
  applications: ComprehensiveUserApplicationData[];
}
export default function MyApplications({ applications }: Props) {
  const title = `My submitted applications`;
  return (
    <Fragment>
      {!applications.length ? (
        <EmptyContainer
          title="Nothing to show"
          description="All the user's submitted applications shall appear here."
          className="[&_svg]:hidden"
        />
      ) : (
        <DataTable
          data={applications}
          columns={useComprehensiveUserApplicationsColumns}
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
