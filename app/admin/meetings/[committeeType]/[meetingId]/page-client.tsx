"use client";

import CardMeetingApplications from "@/components/application/meetings/card-meeting-applications";
import CardStartMeeting from "@/components/application/meetings/card-start-meeting";
import ButtonAddEditMinute from "@/components/application/meetings/minute/button-add-edit-minute";
import ListOfMeetingMinutes from "@/components/application/meetings/minute/list-of-meeting-minutes";
import { useMeetingQuery } from "@/components/application/meetings/query";
import CommandItemUser from "@/components/application/users/command-item-user";
import Container from "@/components/container";
import { TypographyH2 } from "@/components/headings";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { committees, meetingStatuses } from "@/lib/enums";
import { Committee } from "@/lib/generated/prisma/enums";
import { MeetingData } from "@/lib/types";
import { AlertTriangleIcon } from "lucide-react";
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
  const title = `${meetingTitle}`.substring(0, 25);

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
      {/* Minute the meeting  */}
      {!minute ? (
        <EmptyContainer
          icon={AlertTriangleIcon}
          title="This meeting is not minuted"
          description="This meeting has not been minuted yet. Start minuting the meeting"
          // className="bg-muted outline"
        >
          <ButtonAddEditMinute meeting={meeting}>
            Start minuting
          </ButtonAddEditMinute>
        </EmptyContainer>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex flex-row gap-3 justify-between items-center">
              <div className="space-y-1.5">
                <CardTitle>Minutes of the meeting</CardTitle>
                <CardDescription>
                  You can view the minute details in the minutes section below.
                </CardDescription>
              </div>
              <ButtonAddEditMinute
                meeting={meeting}
                minute={minute}
                className="ml-3"
              >
                Update minute
              </ButtonAddEditMinute>
            </div>
          </CardHeader>
          <CardContent>
            <ListOfMeetingMinutes meeting={meeting} />
          </CardContent>
        </Card>
      )}
      {/* invited members  */}
      <div>
        {!!invitedMembers.length && (
          <Item>
            <ItemContent>
              <ItemTitle>Invited Members</ItemTitle>
              {invitedMembers.map((user) => (
                <CommandItemUser
                  key={user.id}
                  user={user}
                  isChecked={false}
                  avatarSize="45px"
                />
              ))}
            </ItemContent>
          </Item>
        )}
      </div>
    </Container>
  );
}
