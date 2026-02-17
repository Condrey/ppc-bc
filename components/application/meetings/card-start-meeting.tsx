"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "@/components/ui/item";
import { MeetingStatus } from "@/lib/generated/prisma/enums";
import { MeetingData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { AlarmClockIcon, DotIcon, MapPinIcon } from "lucide-react";
import ButtonStartMeeting from "./session/button-start-meeting";

interface Props {
  meeting: MeetingData;
  className?: string;
}
export default function CardStartMeeting({ meeting, className }: Props) {
  const {
    title: meetingTitle,
    minute,
    venue,
    happeningOn,
    postponedOn,
    committee,
    applications,
    id,
    status,
  } = meeting;
  const title = minute
    ? `${minute.minuteNumber} meeting`
    : `${meetingTitle}`.substring(0, 25);
  const meetingInProgress = status === MeetingStatus.IN_PROGRESS;
  return (
    <Item variant={"muted"} className={cn("", className)}>
      <ItemContent>
        <ItemTitle>
          <Badge>{committee}</Badge>
          {title}
        </ItemTitle>
        <ItemDescription>
          <span>
            <MapPinIcon className="inline size-4 text-muted fill-muted-foreground" />
            {venue}
          </span>
          <DotIcon className="inline" />
          <span>
            {postponedOn ? (
              <span>
                {formatDate(postponedOn!, "PPPPp")}{" "}
                <span className="text-accent-foreground font-mono font-thin italic">
                  (Postponed)
                </span>
              </span>
            ) : (
              formatDate(happeningOn!, "PPPPp")
            )}
          </span>
        </ItemDescription>

        <ItemFooter>
          {minute ? (
            <div>{minute.minuteNumber}</div>
          ) : (
            <span className="text-warning">Not yet minuted</span>
          )}
        </ItemFooter>
      </ItemContent>
      <ItemActions className="justify-end items-end">
        <Button variant={"outline"}>Postpone</Button>
        <div className="flex flex-col gap-2 items-center">
          <span>
            <AlarmClockIcon className="inline size-4 mr-2" />
            44 mins
          </span>
          <ButtonStartMeeting meeting={meeting} disabled={!applications.length}>
            {meetingInProgress ? "Resume meeting" : "Start Meeting"}
          </ButtonStartMeeting>
        </div>
      </ItemActions>
    </Item>
  );
}
