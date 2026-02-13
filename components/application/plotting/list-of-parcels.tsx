"use client";

import { TypographyH4 } from "@/components/headings";
import { ParentApplicationData } from "@/lib/types";
import { DataTable } from "../../data-table/data-table";
import { EmptyContainer } from "../../query-container/empty-container";
import ErrorContainer from "../../query-container/error-container";
import ButtonAddEditPpaForm1 from "../parent-application/ppaForm/button-add-edit-ppa-form1";
import { useParentApplicationsQuery } from "../parent-application/query";
import { useParcelsColumns } from "./columns";

export default function ListOfParcels({
  initialData,
}: {
  initialData: ParentApplicationData[];
}) {
  const query = useParentApplicationsQuery(initialData);

  const { data: parentApplications, status } = query;
  if (status === "error") {
    return (
      <ErrorContainer errorMessage="Failed to fetch parcels" query={query} />
    );
  }
  if (!parentApplications.length) {
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
    <>
      <DataTable
        data={parentApplications}
        columns={useParcelsColumns}
        filterColumn={{ id: "application_applicant_name", label: "applicant" }}
        tableHeaderSection={
          <TypographyH4 text="Table showing Parcels and Plotting" />
        }
        className="w-full"
      ></DataTable>
    </>
  );
}
