/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { roles } from "@/lib/enums";
import { UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Edit3Icon } from "lucide-react";
import Link from "next/link";
import ButtonAddEditUser from "./button-add-edit-user";
import UserItem from "./user-item";

export const useUsersColumns: ColumnDef<UserData>[] = [
  {
    id: "index",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="s/n" />
    ),
    cell: ({ row }) => <span>{formatNumber(row.index + 1)}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell({ row }) {
      return (
        <UserItem
          user={row.original}
          isChecked={false}
          variant={"default"}
          className="p-0"
        />
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Relationship" />
    ),
    cell({ row }) {
      const { title } = roles[row.original.role];
      return <Badge variant={"outline"}>{title}</Badge>;
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },

  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const { getNavigationLinkWithPathnameWithoutUpdate } =
        useCustomSearchParams();
      const url = getNavigationLinkWithPathnameWithoutUpdate(
        `/admin/users/user/${row.original.id}`,
      );
      return (
        <div className="flex  gap-2.5">
          <ButtonAddEditUser user={row.original} variant={"secondary"}>
            <Edit3Icon />
          </ButtonAddEditUser>
          <Link href={url} className={buttonVariants()}>
            View More
          </Link>
        </div>
      );
    },
  },
];
