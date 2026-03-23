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
}: {
  initialData: ParentApplicationData[];
  applicationType?: ApplicationType;
}) {
  const query = useParentApplicationsQuery(initialData, applicationType);
  const { data: parentApplications, status } = query;

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
        <ButtonAddEditPpaForm1>Add new PPA Form1</ButtonAddEditPpaForm1>
      </EmptyContainer>
    );
  }
  return (
    <DataTable
      data={parentApplications.map((a, index) => ({ ...a, id: index + a.id }))}
      columns={usePpaForm1Columns}
      filterColumn={{
        id: "application_applicant_name",
        label: "applicant",
      }}
      fab={
        <ButtonAddEditPpaForm1
          className="rounded-full shadow-2xs"
          size={"icon-xl"}
        >
          <PlusIcon className="inline" />
        </ButtonAddEditPpaForm1>
      }
      cardRenderer={(item) => (
        <PpaFormItem
          item={item}
          navigateTo={`/admin/registration/ppa-form/${item.id}`}
        />
      )}
      className="w-full"
    >
      <ButtonAddEditPpaForm1 size={"sm"} variant={"secondary"}>
        <PlusIcon /> New
      </ButtonAddEditPpaForm1>
    </DataTable>
  );
}
