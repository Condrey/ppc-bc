"use client";

import { EmptyContainer } from "@/components/query-container/empty-container";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { ApplicationType } from "@/lib/generated/prisma/enums";
import { MeetingData } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { Building2Icon, LandPlotIcon, ShapesIcon } from "lucide-react";

interface Props {
  meeting: MeetingData;
  className?: string;
}
export default function CardMeetingApplications({ meeting, className }: Props) {
  const { applications } = meeting;

  const hasApplications = !!applications.length;
  const landApplications = applications.filter(
    (app) => app.type === ApplicationType.LAND,
  );
  const buildingApplications = applications.filter(
    (app) => app.type === ApplicationType.BUILDING,
  );
  const _applications = [
    {
      title: "Land",
      count: landApplications.length,
      icon: LandPlotIcon,
    },
    {
      title: "Building",
      count: buildingApplications.length,
      icon: Building2Icon,
    },
    {
      title: "Overall",
      count: applications.length,
      icon: ShapesIcon,
    },
  ];
  return (
    <Item
      variant={hasApplications ? "outline" : "destructive"}
      className={cn("", className)}
    >
      <ItemContent>
        {hasApplications && <ItemTitle>Available applications</ItemTitle>}
        {!hasApplications ? (
          <EmptyContainer
            title="No applications"
            description={"Start by adding applications to the meeting"}
            className="[&_svg]:hidden md:p-0 p-0"
          >
            <Button>Add Applications</Button>
          </EmptyContainer>
        ) : (
          <div className="flex flex-row gap-2 flex-wrap">
            {_applications.map(({ count, title, icon: Icon }) => (
              <Item
                key={title}
                variant={"outline"}
                className="first:bg-success first:text-success-foreground even:bg-warning even:text-warning-foreground last:bg-primary last:text-primary-foreground last:flex-1"
              >
                <ItemContent>
                  <ItemTitle>
                    <Icon />
                    {title}
                  </ItemTitle>
                  <ItemDescription className="text-inherit/50 font-sans slashed-zero oldstyle-nums">{`${formatNumber(count)} application${count === 1 ? "" : "s"}`}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </div>
        )}
      </ItemContent>
    </Item>
  );
}
