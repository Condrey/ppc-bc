"use client";

import { ApplicationType } from "@/lib/generated/prisma/enums";
import { ParentApplicationData } from "@/lib/types";

interface Props {
  applications: ParentApplicationData[];
  applicationType: ApplicationType;
}
export function PageClient({
  applications: initialData,
  applicationType,
}: Props) {
  // const query = useQuery({
  //   queryKey: ["meetings", committeeType],
  //   queryFn: async () => getAllCommitteeMeetings(committeeType),
  //   initialData,
  // });
  // const { data: meetings, status } = query;
  // if (status === "error") {
  //   return (
  //     <ErrorContainer errorMessage="Failed to fetch meetings" query={query} />
  //   );
  // }
  // if (!meetings.length) {
  //   return (
  //     <EmptyContainer
  //       title="No meetings"
  //       description="No meetings have been set up so far. Please set one up!"
  //     >
  //       <Button>Set up meeting</Button>
  //     </EmptyContainer>
  //   );
  // }

  return <div>dkjgkjdgsjgkjgkjkkjkjgg</div>;
}
