"use client";

import { DataTable } from "@/components/data-table/data-table";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { UserData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";
import { getAllUsers } from "./action";
import ButtonAddEditUser from "./button-add-edit-user";
import { useUsersColumns } from "./columns";

interface Props {
  initialData: UserData[];
}
export function ListOfUsers({ initialData }: Props) {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    initialData,
  });
  const { status, data } = query;
  if (status === "error") {
    return (
      <ErrorContainer errorMessage="Failed to get all members" query={query} />
    );
  }
  if (status === "success" && !data.length) {
    return (
      <EmptyContainer
        title="There are no members assigned yet."
        description="Please use the button below to add a member."
      >
        <ButtonAddEditUser>Add a Member</ButtonAddEditUser>
      </EmptyContainer>
    );
  }
  return (
    <Suspense>
      <DataTable
        data={data}
        columns={useUsersColumns}
        filterColumn={{ id: "name" }}
        className="w-full"
      >
        <ButtonAddEditUser>
          <PlusIcon /> Member
        </ButtonAddEditUser>
      </DataTable>
    </Suspense>
  );
}
