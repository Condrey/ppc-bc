"use client";

import { getAllCommitteeMeetings } from "@/components/application/meetings/action";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { Button } from "@/components/ui/button";
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
        <Button>Set up meeting</Button>
      </EmptyContainer>
    );
  }

  return <></>;
}
