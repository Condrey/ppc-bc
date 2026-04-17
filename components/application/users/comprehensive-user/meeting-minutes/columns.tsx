"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { committees, meetingStatuses } from "@/lib/enums";
import { ComprehensiveUserMinuteData } from "@/lib/types";
import { getMeetingNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import CommandItemUser from "../../command-item-user";

export const useComprehensiveUserAbsentWithApologyMinuteColumns: ColumnDef<ComprehensiveUserMinuteData>[] =
  [
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
      accessorKey: "meeting",
      header({ column }) {
        return <DataTableColumnHeader column={column} title="Meeting" />;
      },
      cell({ row }) {
        const {
          meeting: { meetingNo, happeningOn, postponedOn, status, committee },
        } = row.original;
        const date = postponedOn ? postponedOn : happeningOn;
        const meetingNumber = getMeetingNumber(meetingNo, date);
        const { title: meetingStatus, variant } = meetingStatuses[status];
        const { shortForm: committeeBody } = committees[committee];
        return (
          <div>
            <div>{committeeBody}</div>
            <div>{meetingNumber}</div>
            <Badge variant={variant}>{meetingStatus}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "meeting.happeningOn",
      header({ column }) {
        return (
          <DataTableColumnHeader
            column={column}
            title="Meeting time and dates"
          />
        );
      },
      cell({ row }) {
        const {
          meeting: { happeningOn, postponedOn, endedAt },
        } = row.original;
        const startAt = postponedOn ?? happeningOn;
        return (
          <div className=" flex flex-col items-center">
            <div>{formatDate(startAt, "PPPp")}</div>
            <div className="text-success">To</div>
            <div>
              {!endedAt ? "still On-going" : formatDate(endedAt, "PPPp")}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "chairedBy.name",
      header({ column }) {
        return (
          <DataTableColumnHeader column={column} title="Meeting Chairperson" />
        );
      },
      cell({ row }) {
        const { chairedBy } = row.original;
        return (
          <CommandItemUser
            user={chairedBy}
            isChecked={false}
            avatarSize="45px"
            className="max-w-fit"
          />
        );
      },
    },
    {
      accessorKey: "writtenBy.name",
      header({ column }) {
        return (
          <DataTableColumnHeader column={column} title="Meeting Secretary" />
        );
      },
      cell({ row }) {
        const { writtenBy } = row.original;
        return (
          <CommandItemUser
            user={writtenBy}
            isChecked={false}
            avatarSize="45px"
            className="max-w-fit"
          />
        );
      },
    },
  ];
