"use client";

import { getApplicationById } from "@/components/application/parent-application/actions";
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
        errorMessage="Failed to fetch ppa1 form  details"
        query={query}
      />
    );
  }
  if (!application)
    return (
      <EmptyContainer
        title="No such ppa1 form "
        description="A ppa1 form  with such details does not exist."
      />
    );
  const { applicationNo, year, type } = application;
  const applicationNumber = getApplicationNumber(applicationNo, year, type);
  return (
    <Container
      breadcrumbs={[
        { title: "Dashboard", href: "/admin" },
        {
          title: `PPA1 forms`,
          href: `/admin/registration/ppa-form`,
        },
        { title: applicationNumber },
      ]}
    >
      <TypographyH2
        text={`${applicationNumber} PPA1 form`}
        className="line-clamp-2 slashed-zero  oldstyle-nums flex gap-3 items-center  "
      />
      <span>pending development</span>
    </Container>
  );
}
