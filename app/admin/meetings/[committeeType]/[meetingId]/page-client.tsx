"use client";

import CardMeetingApplications from "@/components/application/meetings/card-meeting-applications";
import CardStartMeeting from "@/components/application/meetings/card-start-meeting";
import { useMeetingQuery } from "@/components/application/meetings/query";
import Container from "@/components/container";
import { TypographyH2 } from "@/components/headings";
import ErrorContainer from "@/components/query-container/error-container";
import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { committees, meetingStatuses } from "@/lib/enums";
import { Committee } from "@/lib/generated/prisma/enums";
import { MeetingData } from "@/lib/types";
import { notFound } from "next/navigation";

interface Props {
  committee: Committee;
  meeting: MeetingData;
}

export default function PageClient({ meeting: initialData, committee }: Props) {
  const query = useMeetingQuery(initialData);
  const { data: meeting, status: queryStatus } = query;
  if (queryStatus === "error") {
    return (
      <ErrorContainer
        errorMessage="Failed to fetch meeting details"
        query={query}
      />
    );
  }
  if (!meeting) return notFound();
  const { minute, title: meetingTitle, invitedMembers, status } = meeting;
  const { title: committeeType } = committees[committee];
  const { title: meetingStatus, variant } = meetingStatuses[status];
  const title = minute
    ? `${minute.minuteNumber} meeting`
    : `${meetingTitle}`.substring(0, 25);

  return (
    <Container
      breadcrumbs={[
        { title: "Dashboard", href: "/admin" },
        {
          title: `${committeeType} meetings`,
          href: `/admin/meetings/${committee}`,
        },
        { title, href: `/admin/meetings/${committee}` },
      ]}
    >
      <TypographyH2
        text={title}
        className="line-clamp-2 flex gap-3 items-center flex-row-reverse "
      >
        <Badge variant={variant}>{meetingStatus}</Badge>
      </TypographyH2>

      <div className="flex flex-col lg:flex-row-reverse gap-4 w-full ">
        <CardStartMeeting meeting={meeting} className="lg:w-3/5" />
        <CardMeetingApplications meeting={meeting} className="lg:w-2/5" />
      </div>
      <div>
        {!!invitedMembers.length && (
          <Item>
            <ItemContent>
              <ItemTitle>Invited Members</ItemTitle>
              {invitedMembers.map(
                ({ name, avatarUrl, email, id, role, username }) => (
                  <div key={id}>
                    <ItemTitle>{name}</ItemTitle>
                  </div>
                ),
              )}
            </ItemContent>
          </Item>
        )}
      </div>
    </Container>
  );
}
