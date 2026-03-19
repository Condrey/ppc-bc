"use client";

import CardMeetingApplications from "@/components/application/meetings/card-meeting-applications";
import CardStartMeeting from "@/components/application/meetings/card-start-meeting";
import ButtonAddEditMinute from "@/components/application/meetings/minute/button-add-edit-minute";
import ButtonDownloadMinute from "@/components/application/meetings/minute/button-download-minute";
import ListOfMeetingMinutes from "@/components/application/meetings/minute/list-of-meeting-minutes";
import { useMeetingQuery } from "@/components/application/meetings/query";
import CommandItemUser from "@/components/application/users/command-item-user";
import Container from "@/components/container";
import { TypographyH2 } from "@/components/headings";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { committees } from "@/lib/enums";
import { Committee } from "@/lib/generated/prisma/enums";
import { MeetingData } from "@/lib/types";
import { getMeetingNumber } from "@/lib/utils";
import {
  AlertTriangleIcon,
  DownloadIcon,
  Edit3Icon,
  MoreVerticalIcon,
  Trash2Icon,
} from "lucide-react";
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
  const {
    meetingNo,
    happeningOn,
    postponedOn,
    minute,
    title: meetingTitle,
    invitedMembers,
  } = meeting;
  const { title: committeeType } = committees[committee];
  const title = `${meetingTitle}`;
  const date = postponedOn ? postponedOn : happeningOn;
  const meetingNumber = getMeetingNumber(meetingNo, date);
  return (
    <Container
      breadcrumbs={[
        { title: "Dashboard", href: "/admin" },
        {
          title: `${committeeType} meetings`,
          href: `/admin/meetings/${committee}`,
        },
        { title },
      ]}
    >
      <TypographyH2
        text={meetingNumber + ": " + title}
        className="line-clamp-2 slashed-zero  oldstyle-nums flex gap-3 items-center  "
      />

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
        <Card className="pb-0 gap-0">
          <CardHeader className="">
            <div className="flex flex-row gap-3 justify-between items-center">
              <div className="space-y-1.5">
                <CardTitle>Minutes of the meeting</CardTitle>
                <CardDescription>
                  You can view the minute details in the minutes section below.
                </CardDescription>
              </div>
              {/* <ButtonDownloadMinute meeting={meeting} variant={"ghost"}>
                <DownloadIcon className="inline mr-2" /> Download minute
              </ButtonDownloadMinute> */}
              <DropdownMenu modal={true}>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"icon-lg"} className="">
                    <span className="sr-only">More actions</span>
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Minute Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <ButtonDownloadMinute meeting={meeting} variant={"ghost"}>
                        <DownloadIcon className="inline mr-2" /> Download minute
                      </ButtonDownloadMinute>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <ButtonAddEditMinute
                        meeting={meeting}
                        minute={minute}
                        variant={"ghost"}
                      >
                        <Edit3Icon /> Update minute
                      </ButtonAddEditMinute>
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" asChild>
                      <Button variant={"ghost"}>
                        <Trash2Icon />
                        Delete Minute
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-0 md:px-0 overflow-hidden">
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
