"use client";

import { getAllCommitteeMeetings } from "@/components/application/meetings/action";
import { useMeetingsColumns } from "@/components/application/meetings/columns";
import ButtonAddEditMeeting from "@/components/application/meetings/form-components/button-add-edit-meeting";
import { DataTable } from "@/components/data-table/data-table";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { Committee } from "@/lib/generated/prisma/enums";
import { MeetingData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface Props {
  meetings: MeetingData[];
  committeeType: Committee;
}
export function PageClient({ meetings: initialData, committeeType }: Props) {
  const query = useQuery({
    queryKey: ["meetings", committeeType],
    queryFn: async () => getAllCommitteeMeetings(committeeType),
    initialData,
  });
  const { data: meetings, status } = query;
  if (status === "error") {
    return (
      <ErrorContainer errorMessage="Failed to fetch meetings" query={query} />
    );
  }
  if (!meetings.length) {
    return (
      <EmptyContainer
        title="No meetings"
        description="No meetings have been set up so far. Please set one up!"
      >
        <ButtonAddEditMeeting committee={committeeType}>
          Set up meeting
        </ButtonAddEditMeeting>
      </EmptyContainer>
    );
  }

  return (
    <DataTable
      data={meetings}
      columns={useMeetingsColumns}
      filterColumn={{ id: "minute_minuteNumber", label: "minute number" }}
      className="w-full"
    ></DataTable>
  );
}
