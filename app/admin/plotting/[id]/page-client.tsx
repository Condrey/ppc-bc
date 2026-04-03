"use client";

import { getApplicationById } from "@/components/application/parent-application/actions";
import PlottingContainer from "@/components/application/plotting/plotting-container";
import Container from "@/components/container";
import { TypographyH2 } from "@/components/headings";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { ApplicationData } from "@/lib/types";
import { getApplicationNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface Props {
  application: ApplicationData;
}

export default function PageClient({ application: initialData }: Props) {
  const id = initialData.id;
  const query = useQuery({
    queryKey: ["application", id],
    queryFn: getApplicationById.bind(undefined, id),
    initialData,
  });
  const { data: application, status: queryStatus } = query;
  if (queryStatus === "error") {
    return (
      <ErrorContainer
        errorMessage="Failed to fetch Plotting and parcel  details"
        query={query}
      />
    );
  }
  if (!application)
    return (
      <EmptyContainer
        title="No such Plotting and parcel "
        description="A Plotting and parcel  with such details does not exist."
      />
    );
  const { applicationNo, year, type } = application;
  const applicationNumber = getApplicationNumber(applicationNo, year, type);
  return (
    <Container
      breadcrumbs={[
        { title: "Dashboard", href: "/admin" },
        {
          title: `Plotting and parcels`,
          href: `/admin/plotting`,
        },
        { title: applicationNumber },
      ]}
    >
      <TypographyH2
        text={`${applicationNumber} Plotting and parcel`}
        className="line-clamp-2 slashed-zero  oldstyle-nums flex gap-3 items-center  "
      />
      <PlottingContainer application={application} />
    </Container>
  );
}
