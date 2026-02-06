"use client";

import { DataTable } from "@/components/data-table/data-table";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { ParentApplicationData } from "@/lib/types";
import { getApplicationNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";
import { getAllApplicationFeeAssessments } from "./action";
import { useApplicationFeeAssessmentsColumns } from "./columns";
import DropDownMenuFeesAssessment from "./drop-down-menu-fees-assessment";

interface Props {
  parentApplication: ParentApplicationData;
}
export function ListOfApplicationFeesAssessments({ parentApplication }: Props) {
  const { application } = parentApplication;
  const {
    applicationNo,
    type,
    year,
    id: applicationId,
    feeAssessments: initialData,
  } = application;
  const applicationNumber = getApplicationNumber(applicationNo, year, type);

  const query = useQuery({
    queryKey: ["fee-assessment", "application", applicationId],
    queryFn: async () => getAllApplicationFeeAssessments(applicationId),
    initialData,
  });
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
        title="No fee assessments."
        description={`This application of ${applicationNumber} has not been levied any fee yet.`}
      >
        <DropDownMenuFeesAssessment
          isADropDown={false}
          parentApplication={parentApplication}
        >
          Issue a fee
        </DropDownMenuFeesAssessment>
      </EmptyContainer>
    );
  }
  return (
    <Suspense>
      <DataTable
        data={data}
        columns={useApplicationFeeAssessmentsColumns}
        filterColumn={{
          id: "application_applicant_name",
          label: "applicant",
        }}
        className="w-full"
      >
        <DropDownMenuFeesAssessment
          isADropDown={false}
          parentApplication={parentApplication}
          size={"sm"}
          variant={"secondary"}
        >
          <PlusIcon /> new fee
        </DropDownMenuFeesAssessment>
      </DataTable>
    </Suspense>
  );
}
