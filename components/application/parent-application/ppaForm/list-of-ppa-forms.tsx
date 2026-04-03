"use client";

import { ApplicationType } from "@/lib/generated/prisma/enums";
import { ParentApplicationData } from "@/lib/types";
import { PlusIcon } from "lucide-react";
import { DataTable } from "../../../data-table/data-table";
import { EmptyContainer } from "../../../query-container/empty-container";
import ErrorContainer from "../../../query-container/error-container";
import { useParentApplicationsQuery } from "../query";
import ButtonAddEditPpaForm1 from "./button-add-edit-ppa-form1";
import { usePpaForm1Columns } from "./columns";
import PpaFormItem from "./ppa-form-item";

export default function ListOfPpaForm1s({
  initialData,
  applicationType,
  navigateToParent,
}: {
  initialData: ParentApplicationData[];
  applicationType?: ApplicationType;
  navigateToParent?: string;
}) {
  const query = useParentApplicationsQuery(initialData, applicationType);
  const { data: parentApplications, status } = query;
  const columns = usePpaForm1Columns(navigateToParent);

  if (status === "error") {
    return (
      <ErrorContainer errorMessage="Failed to fetch PPA1 forms" query={query} />
    );
  }
  if (!parentApplications.length) {
    return (
      <EmptyContainer
        title="Empty data"
        description="There are currently no PPA1 forms in the database. Please add"
      >
        <ButtonAddEditPpaForm1 applicationType={applicationType}>
          Add new PPA Form1
        </ButtonAddEditPpaForm1>
      </EmptyContainer>
    );
  }
  return (
    <DataTable
      data={parentApplications}
      columns={columns}
      filterColumn={{
        id: "application_applicant_name",
        label: "applicant",
      }}
      fab={
        <ButtonAddEditPpaForm1
          applicationType={applicationType}
          className="rounded-full shadow-2xs"
          size={"icon-xl"}
        >
          <PlusIcon className="inline" />
        </ButtonAddEditPpaForm1>
      }
      cardRenderer={(item) => (
        <PpaFormItem
          item={item}
          navigateTo={`${navigateToParent ? `${navigateToParent}${item.application.type}/${item.id}` : `/admin/registration/ppa-form/${item.applicationId}`}`}
        />
      )}
      className="w-full"
    >
      <ButtonAddEditPpaForm1
        size={"sm"}
        applicationType={applicationType}
        variant={"secondary"}
      >
        <PlusIcon /> New
      </ButtonAddEditPpaForm1>
    </DataTable>
  );
}
