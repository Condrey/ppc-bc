"use client";

import { DataTable } from "@/components/data-table/data-table";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { feesAssessmentTypes } from "@/lib/enums";
import { FeeAssessmentType } from "@/lib/generated/prisma/enums";
import { ParentApplicationData } from "@/lib/types";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";
import ButtonAddEditPpaForm1 from "../ppaForm/button-add-edit-ppa-form1";
import { useFeeAssessmentParentApplicationsQuery } from "../query";
import { usePaymentAssessmentsColumns } from "./payments/columns";

interface Props {
  initialData: ParentApplicationData[];
  feeAssessmentType: FeeAssessmentType;
}
export function ListOfTypeBasedFeesAssessments({
  initialData,
  feeAssessmentType,
}: Props) {
  const { title } = feesAssessmentTypes[feeAssessmentType];
  const query = useFeeAssessmentParentApplicationsQuery(
    initialData,
    feeAssessmentType,
  );
  const { status, data } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage={`Failed to get ${title} payment assessments`}
        query={query}
      />
    );
  }
  if (status === "success" && !data.length) {
    return (
      <EmptyContainer
        title={`No ${title} fee assessments.`}
        description={`No developer has been charged ${title} fee as of now.`}
      ></EmptyContainer>
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
