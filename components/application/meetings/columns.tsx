import { buttonVariants } from "@/components/ui/button";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { committees, meetingStatuses } from "@/lib/enums";
import { MeetingStatus } from "@/lib/generated/prisma/enums";
import { MeetingData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import Link from "next/link";
import { useTransition } from "react";
import ButtonAddEditMeeting from "./form-components/button-add-edit-meeting";

export const useMeetingsColumns: ColumnDef<MeetingData>[] = [
  {
    id: "index",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="s/n" />;
    },
    cell({ row }) {
      return <span>{row.index + 1}</span>;
    },
  },
  {
    accessorKey: "minute.minuteNumber",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Minute number" />;
    },
    cell({ row }) {
      const { minute } = row.original;
      return (
        <div>
          {!minute ? (
            <div className="text-destructive">Not minuted</div>
          ) : (
            <div className="text-xs text-muted-foreground">
              {minute.minuteNumber}
            </div>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Meeting status" />;
    },
    cell({ row }) {
      const { status, postponedOn } = row.original;
      const { title, variant } = meetingStatuses[status];
      return (
        <div>
          <Badge variant={variant}>{title}</Badge>
          {status === MeetingStatus.POSTPONED && (
            <div>
              <span className="text-muted-foreground italic">on: </span>
              {formatDate(postponedOn!, "PPp")}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "committee",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Committee" />;
    },
    cell({ row }) {
      const { committee } = row.original;
      const { title } = committees[committee];
      return <div>{title}</div>;
    },
  },
  {
    accessorKey: "applications",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Applications" />;
    },
    cell({ row }) {
      const { applications } = row.original;
      const numberOfApplications = applications.length;
      return (
        <div>
          {!applications.length ? (
            <span className="text-destructive ">Not yet added</span>
          ) : (
            <span>{`${numberOfApplications} application${numberOfApplications === 1 ? "" : "s"}`}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "venue",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Venue" />;
    },
  },
  {
    accessorKey: "happeningOn",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Date" />;
    },
    cell({ row }) {
      const { happeningOn } = row.original;
      return <span>{formatDate(happeningOn!, "PPp")}</span>;
    },
  },

  {
    id: "actions",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Actions" />;
    },
    cell({ row }) {
      const { id, committee } = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isPending, startTransition] = useTransition();
      const { getNavigationLinkWithPathnameWithoutUpdate } =
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useCustomSearchParams();

      const url = getNavigationLinkWithPathnameWithoutUpdate(
        `/admin/meetings/${committee}/${id}`,
      );
      return (
        <div className="flex gap-2 items-center">
          <ButtonAddEditMeeting
            meeting={row.original}
            committee={committee}
            size={"sm"}
          >
            Edit
          </ButtonAddEditMeeting>
          <Link
            href={url}
            onClick={() => startTransition(() => {})}
            className={buttonVariants({ size: "sm" })}
          >
            {isPending && <Spinner className="inline" />} View
          </Link>
        </div>
      );
    },
  },
];
