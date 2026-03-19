import { Item, ItemContent, ItemDescription } from "@/components/ui/item";
import { DashboardItems } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

export default function SectionApplicantsApplications({
  dashboardItem: { applicants, admins },
}: {
  dashboardItem: DashboardItems;
}) {
  const items: { user: string; count: number }[] = [
    { user: "Applicant", count: applicants },
    { user: "Administrator", count: admins },
  ];
  return (
    <div className=" flex flex-col md:grid md:grid-cols-2  gap-4">
      {items.map(({ user, count }) => {
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
  );
}
