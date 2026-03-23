import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { applicationTypes } from "@/lib/enums";
import { Application } from "@/lib/generated/prisma/client";
import { ApplicationType } from "@/lib/generated/prisma/enums";
import { DashboardItems } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";

export default function SectionApplicantsApplications({
  dashboardItem: { applicants, admins, landApplication, buildingApplication },
}: {
  dashboardItem: DashboardItems;
}) {
  const users: { user: string; count: number }[] = [
    { user: "Applicant", count: applicants },
    { user: "Administrator", count: admins },
  ];

  const applications: {
    type: ApplicationType;
    items: { label: string; count: number }[];
    count: number;
    first: Application | undefined;
  }[] = [
    {
      type: "LAND",
      items: [
        { label: "approved", count: landApplication.approvedLandApplications },
        { label: "deferred", count: landApplication.deferredLandApplications },
        { label: "rejected", count: landApplication.rejectedLandApplications },
      ],
      count: landApplication.count,
      first: landApplication.firstApplication?.application,
    },
    {
      type: "BUILDING",
      items: [
        {
          label: "approved",
          count: buildingApplication.approvedBuildingApplications,
        },
        {
          label: "deferred",
          count: buildingApplication.deferredBuildingApplications,
        },
        {
          label: "rejected",
          count: buildingApplication.rejectedBuildingApplications,
        },
      ],
      count: buildingApplication.count,
      first: buildingApplication.firstApplication?.application,
    },
  ];
  return (
    <>
      <div className=" flex flex-col md:grid md:grid-cols-2  gap-4">
        {users.map(({ user, count }) => {
          const isEven = count % 2 === 0;
          return (
            <Item
              key={user}
              variant={isEven ? "success" : "warning"}
              className={cn(
                isEven
                  ? "border-r-8 border-success "
                  : "border-l-8 border-warning",
              )}
            >
              <ItemContent>
                <h1>{formatNumber(count)}</h1>
                <ItemDescription>{`${user}${count === 1 ? "" : "s"}`}</ItemDescription>
              </ItemContent>
            </Item>
          );
        })}
      </div>
      <div className="flex flex-col *:flex-1 md:flex-row flex-wrap gap-3">
        {applications.map(({ type, items, count, first }) => {
          const { title } = applicationTypes[type];

          return (
            <Item key={type} variant={"muted"} className="shadow-2xs">
              <ItemContent>
                <ItemTitle className="uppercase">
                  {title}s{": "}
                  <span className="text-muted-foreground capitalize">{`${formatNumber(count)} application${count === 1 ? "" : "s"}`}</span>
                </ItemTitle>
                {!!first && (
                  <ItemDescription className="text-xs">
                    Since {formatDate(first.createdAt, "PPP")}
                  </ItemDescription>
                )}
              </ItemContent>
              <ItemContent className="flex flex-row justify-center gap-4">
                {items.map(({ label, count }) => (
                  <div
                    key={label}
                    className="p-3 border font-sans slashed-zero"
                  >
                    {formatNumber(count)} {label}
                  </div>
                ))}
              </ItemContent>
            </Item>
          );
        })}
      </div>
    </>
  );
}
