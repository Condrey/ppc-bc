"use client";

import { TypographyH4 } from "@/components/headings";
import { LandApplicationData } from "@/lib/types";
import { DataTable } from "../../../data-table/data-table";
import { EmptyContainer } from "../../../query-container/empty-container";
import ErrorContainer from "../../../query-container/error-container";
import ButtonAddEditPpaForm1 from "../../land-application/ppaForm/button-add-edit-ppa-form1";
import { useLandApplicationsQuery } from "../../land-application/query";
import { usePpcInspectionsColumns } from "./columns";

export default function ListOfPpcInspectionApplications({
  initialData,
}: {
  initialData: LandApplicationData[];
}) {
  const query = useLandApplicationsQuery(initialData);

  const { data: landApplications, status } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage="Failed to fetch inspection applications"
        query={query}
      />
    );
  }
  if (!landApplications.length) {
    return (
      <EmptyContainer
        title="Empty data"
        description="There are currently no PPA1 forms in the database. Please add"
      >
        <ButtonAddEditPpaForm1>Add new PPA Form1</ButtonAddEditPpaForm1>
      </EmptyContainer>
    );
  }
  return (
    <DataTable
      data={landApplications}
      columns={usePpcInspectionsColumns}
      filterColumn={{ id: "application_applicant_name", label: "applicant" }}
      tableHeaderSection={<TypographyH4 text="Inspection Applications" />}
      className="w-full"
    ></DataTable>
  );
}
