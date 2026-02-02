"use client";

import { TypographyH4 } from "@/components/headings";
import { LandApplicationData } from "@/lib/types";
import { PlusIcon } from "lucide-react";
import { DataTable } from "../../../data-table/data-table";
import { EmptyContainer } from "../../../query-container/empty-container";
import ErrorContainer from "../../../query-container/error-container";
import { useLandApplicationsQuery } from "../query";
import ButtonAddEditPpaForm1 from "./button-add-edit-ppa-form1";
import { usePpaForm1Columns } from "./columns";

export default function ListOfPpaForm1s({
  initialData,
}: {
  initialData: LandApplicationData[];
}) {
  const query = useLandApplicationsQuery(initialData);

  const { data: landApplications, status } = query;
  if (status === "error") {
    return (
      <ErrorContainer errorMessage="Failed to fetch PPA1 forms" query={query} />
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
      columns={usePpaForm1Columns}
      filterColumn={{ id: "application_applicant_name", label: "applicant" }}
      tableHeaderSection={
        <TypographyH4 text="Applications for Development Permit" />
      }
      className="w-full"
    >
      <ButtonAddEditPpaForm1 size={"sm"} variant={"secondary"}>
        <PlusIcon /> New
      </ButtonAddEditPpaForm1>
    </DataTable>
  );
}
