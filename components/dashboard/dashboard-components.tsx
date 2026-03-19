"use client";

import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { DashboardItems } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getDashboardInfo } from "./action";
import SectionApplicantsApplications from "./section-applicants-applications";
import SectionFeeChart from "./section-fee-chart";
import SectionMeetings from "./section-meetings";

export default function DashboardComponents({
  initialData,
}: {
  initialData: DashboardItems;
}) {
  const query = useQuery({
    queryKey: ["dashboard-items"],
    queryFn: getDashboardInfo,
    initialData,
  });
  const { status, data } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage="Failed to fetch dashboard items"
        query={query}
      />
    );
  }
  if (!data) {
    return (
      <EmptyContainer
        title="No dashboard components"
        description="All summarized information about the system shall appear here."
      />
    );
  }
  return (
    <div className="gap-12 flex flex-col-reverse md:flex-col">
      {/* Applicants and applications */}
      <SectionApplicantsApplications dashboardItem={data} />
      {/* Chart showing trends in monthly collection  */}
      <SectionFeeChart dashboardItem={data} />
      {/* Meetings and land use  */}
      <SectionMeetings dashboardItem={data} />
    </div>
  );
}
