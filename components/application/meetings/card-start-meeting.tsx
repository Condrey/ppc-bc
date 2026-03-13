"use client";

import { Badge } from "@/components/ui/badge";
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
import ButtonPostponeMeeting from "./session/button-postpone-meeting";
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
    status,
  } = meeting;
  const title = `${meetingTitle}`.substring(0, 25);
  const meetingNotStarted =
    status === MeetingStatus.PENDING || status === MeetingStatus.POSTPONED;
  return (
    <Item
      variant={"muted"}
      className={cn(
        "flex flex-col items-start sm:items-center sm:flex-row",
        className,
      )}
    >
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
            <span className="text-success">{"Minuted"}</span>
          ) : (
            <span className="text-warning">Not yet minuted</span>
          )}
        </ItemFooter>
      </ItemContent>
      <ItemActions className="justify-end items-end flex flex-row-reverse sm:flex-row">
        {!meetingNotStarted && (
          <ButtonPostponeMeeting meeting={meeting} variant={"outline"}>
            Postpone
          </ButtonPostponeMeeting>
        )}
        <div className="flex sm:flex-col flex-row gap-2 items-center">
          {meetingNotStarted && (
            <span>
              <AlarmClockIcon className="inline size-4 mr-2" />
              44 mins
            </span>
          )}
          <ButtonStartMeeting meeting={meeting} disabled={!applications.length}>
            {meetingNotStarted ? "Start meeting" : "Resume Meeting"}
          </ButtonStartMeeting>
        </div>
      </ItemActions>
    </Item>
  );
}
