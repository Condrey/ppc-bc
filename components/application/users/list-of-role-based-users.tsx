"use client";

import { DataTable } from "@/components/data-table/data-table";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { roles } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import { UserData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";
import { getAllRoleBasedUsers } from "./action";
import ButtonAddEditUser from "./button-add-edit-user";
import { useUsersColumns } from "./columns";

interface Props {
  initialData: UserData[];
  role: Role;
}
export function ListOfRoleBasedUsers({ initialData, role }: Props) {
  const { title } = roles[role];
  const query = useQuery({
    queryKey: ["users", role],
    queryFn: async () => getAllRoleBasedUsers(role),
    initialData,
  });
  const { status, data } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage={`Failed to get all ${title}s`}
        query={query}
      />
    );
  }
  if (status === "success" && !data.length) {
    return (
      <EmptyContainer
        title={`There are no ${title}s assigned yet.`}
        description={`Please use the button below to add ${title}.`}
      >
        <ButtonAddEditUser role={role}>Add {title}</ButtonAddEditUser>
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
        <ButtonAddEditUser role={role}>
          <PlusIcon /> {title}
        </ButtonAddEditUser>
      </DataTable>
    </Suspense>
  );
}
