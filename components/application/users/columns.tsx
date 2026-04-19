/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { memberships, roles } from "@/lib/enums";
import { UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Edit3Icon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
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
      <DataTableColumnHeader column={column} title="Position" />
    ),
    cell({ row }) {
      const { role, ppcMembership } = row.original;
      const { title } = roles[role];
      const { title: membership } = memberships[ppcMembership];
      return (
        <div className="space-y-2 flex flex-col items-center">
          <Badge variant={"outline"}>{title}</Badge>
          <p>{membership}</p>
        </div>
      );
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
      const [isPending, startTransition] = useTransition();
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
          <Button onClick={() => startTransition(() => {})} asChild>
            <Link href={url} className={buttonVariants()}>
              {isPending && <Spinner className="inline mr-2 size-4" />} View
              More
            </Link>
          </Button>
        </div>
      );
    },
  },
];
