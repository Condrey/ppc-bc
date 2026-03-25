"use client";

import { TypographyH4 } from "@/components/headings";
import { ParentApplicationData } from "@/lib/types";
import { DataTable } from "../../../data-table/data-table";
import { EmptyContainer } from "../../../query-container/empty-container";
import ErrorContainer from "../../../query-container/error-container";
import ButtonAddEditPpaForm1 from "../../parent-application/ppaForm/button-add-edit-ppa-form1";
import { useParentApplicationsQuery } from "../../parent-application/query";
import { usePpcInspectionsColumns } from "./columns";
import PpcInspectionItem from "./ppc-insection-item";

export default function ListOfPpcInspectionApplications({
  initialData,
}: {
  initialData: ParentApplicationData[];
}) {
  const query = useParentApplicationsQuery(initialData);

  const { data: parentApplications, status } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage="Failed to fetch inspection applications"
        query={query}
      />
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
    <DataTable
      data={parentApplications}
      columns={usePpcInspectionsColumns}
      filterColumn={{ id: "application_applicant_name", label: "applicant" }}
      tableHeaderSection={<TypographyH4 text="Inspection Applications" />}
      className="w-full"
      cardRenderer={(item) => (
        <PpcInspectionItem
          item={item}
          navigateTo={`/admin/inspections/ppc-inspections/${item.applicationId}`}
        />
      )}
    ></DataTable>
  );
}
