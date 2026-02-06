"use client";

import { DataTable } from "@/components/data-table/data-table";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { ParentApplicationData } from "@/lib/types";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";
import ButtonAddEditPpaForm1 from "../ppaForm/button-add-edit-ppa-form1";
import { useParentApplicationsQuery } from "../query";
import { usePaymentAssessmentsColumns } from "./payments/columns";

interface Props {
  initialData: ParentApplicationData[];
}
export function ListOfFeesAssessments({ initialData }: Props) {
  const query = useParentApplicationsQuery(initialData);
  const { status, data } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage="Failed to get payment assessments"
        query={query}
      />
    );
  }
  if (status === "success" && !data.length) {
    return (
      <EmptyContainer
        title="There are no applications in the database that are under review yet."
        description="Please use the button below to create an application."
      >
        <ButtonAddEditPpaForm1>Create an Application</ButtonAddEditPpaForm1>
      </EmptyContainer>
    );
  }
  return (
    <Suspense>
      <DataTable
        data={data}
        columns={usePaymentAssessmentsColumns}
        filterColumn={{
          id: "application_applicant_name",
          label: "applicant",
        }}
        className="w-full"
      >
        <ButtonAddEditPpaForm1>
          <PlusIcon /> PPA Form 1
        </ButtonAddEditPpaForm1>
      </DataTable>
    </Suspense>
  );
}
