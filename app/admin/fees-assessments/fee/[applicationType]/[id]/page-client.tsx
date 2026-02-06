"use client";

import { getParentApplicationById } from "@/components/application/parent-application/actions";
import Container from "@/components/container";
import { TypographyH1 } from "@/components/headings";
import ErrorContainer from "@/components/query-container/error-container";
import { ApplicationType } from "@/lib/generated/prisma/enums";
import { ParentApplicationData } from "@/lib/types";
import { getApplicationNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";

export default function PageClient({
  initialData,
  applicationType,
}: {
  initialData: ParentApplicationData;
  applicationType: ApplicationType;
}) {
  const id = initialData.id;

  const query = useQuery({
    queryKey: ["parent-application", id],
    queryFn: async () => getParentApplicationById(id, applicationType),
    initialData,
  });
  const { data, status } = query;

  if (!data) return notFound();
  const {
    application: { applicationNo, year, type },
  } = data;
  const applicationNumber = getApplicationNumber(applicationNo, year, type);
  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/" },
        { title: "Fees assessments", href: "/admin/fees-assessments/" },
        {
          title: applicationNumber,
          href: `/admin/fees-assessments/fee/${type}/${id}`,
        },
      ]}
    >
      <div className="flex gap-3">
        <TypographyH1
          text={`Fee Assessments for ${applicationNumber}`}
          className="line-clamp-2"
        />
      </div>
      {status === "error" ? (
        <ErrorContainer
          errorMessage="An error occurred while fetching land application."
          query={query}
        />
      ) : (
        <div></div>
      )}
    </Container>
  );
}
