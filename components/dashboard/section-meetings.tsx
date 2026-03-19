import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { committees, landUseTypes, meetingStatuses } from "@/lib/enums";
import { Meeting } from "@/lib/generated/prisma/client";
import { DashboardItems } from "@/lib/types";
import { formatNumber, getMeetingNumber } from "@/lib/utils";
import { formatDate, isAfter } from "date-fns";
import { HistoryIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

export default function SectionMeetings({
  dashboardItem: {
    meeting: { count, recentMeeting },
    landUsage,
  },
}: {
  dashboardItem: DashboardItems;
}) {
  return (
    <div className=" flex flex-col xl:grid xl:grid-cols-2  gap-4">
      <div className="flex gap-4 flex-wrap md:*:flex-1">
        <Card className="pb-0">
          {recentMeeting && <RecentMeeting meeting={recentMeeting} />}
        </Card>
        <Card className="flex-1">
          <Item className="justify-center items-center">
            <ItemHeader className="justify-center">
              <ItemTitle>Meetings registered</ItemTitle>
            </ItemHeader>
            <ItemContent className="items-center">
              <ItemTitle className="text-4xl font-mono slashed-zero">
                {formatNumber(count)}
              </ItemTitle>
              <ItemDescription className="tracking-widest">{`Meeting${count === 1 ? "" : "s"}`}</ItemDescription>
            </ItemContent>
          </Item>
        </Card>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl">Applications</h2>
        <div className="gap-3 flex flex-wrap">
          {landUsage.map(({ count, type }) => {
            const { title } = landUseTypes[type];
            return (
              <Item key={type} variant={"muted"}>
                <ItemContent className="items-center">
                  <ItemTitle>{title}</ItemTitle>
                  <ItemDescription className="font-mono slashed-zero">
                    {count}
                  </ItemDescription>
                </ItemContent>
              </Item>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RecentMeeting({ meeting }: { meeting: Meeting }) {
  const {
    committee: _committee,
    endedAt,
    happeningOn,
    meetingNo,
    postponedOn,
    status,
    title,
    venue,
  } = meeting;
  const startDate = postponedOn ? postponedOn : happeningOn;
  const formattedStartDate = formatDate(startDate, "PPp");
  const meetingNumber = getMeetingNumber(meetingNo, startDate);
  const { title: meetingStatus, variant } = meetingStatuses[status];
  const { title: committee } = committees[_committee];
  const isRecentMeeting = isAfter(new Date(), startDate);
  const isHappening = status === "IN_PROGRESS";
  return (
    <Item
      variant={
        isHappening ? "success" : isRecentMeeting ? "destructive" : "warning"
      }
    >
      <ItemHeader className="border-b pb-2">
        <ItemTitle className="*:inline-flex inline">
          <HistoryIcon className="size-4 mr-2" />
          {isHappening
            ? "Happening now"
            : isRecentMeeting
              ? "Recent meeting"
              : "Upcoming meeting"}
          ,{" "}
          <time
            className="text-muted-foreground text-sm"
            dateTime={formattedStartDate}
          >
            {formattedStartDate}
          </time>
        </ItemTitle>
        {endedAt && (
          <ItemDescription className="block">
            Ended on {formatDate(endedAt, "PPp")}
          </ItemDescription>
        )}
      </ItemHeader>
      <ItemContent>
        <ItemTitle className="*:inline-flex inline break-keep">
          {committee} <span className="text-warning">{meetingNumber}</span>
        </ItemTitle>
        <ItemDescription className="*:inline-flex inline">
          Title: {title}
        </ItemDescription>
        <ItemDescription className="*:inline-flex inline">
          Venue: {venue}
        </ItemDescription>
        <Badge variant={variant}>{meetingStatus}</Badge>
      </ItemContent>
    </Item>
  );
}
