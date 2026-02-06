"use client";

import { getParentApplicationById } from "@/components/application/parent-application/actions";
import DropDownMenuFeesAssessment from "@/components/application/parent-application/fees-assessment/drop-down-menu-fees-assessment";
import { ListOfApplicationFeesAssessments } from "@/components/application/parent-application/fees-assessment/list-of-application-fees-assessments";
import Container from "@/components/container";
import { TypographyH2 } from "@/components/headings";
import ErrorContainer from "@/components/query-container/error-container";
import { ApplicationType } from "@/lib/generated/prisma/enums";
import { ParentApplicationData } from "@/lib/types";
import { getApplicationNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
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
      <TypographyH2
        text={`Fee Assessments for ${applicationNumber}`}
        className="flex items-center justify-between gap-3"
      >
        <DropDownMenuFeesAssessment
          isADropDown={false}
          parentApplication={data}
          className="ms-auto max-w-fit"
        >
          <PlusIcon /> Fee Assessment
        </DropDownMenuFeesAssessment>
      </TypographyH2>
      {status === "error" ? (
        <ErrorContainer
          errorMessage="An error occurred while fetching application."
          query={query}
        />
      ) : (
        <ListOfApplicationFeesAssessments parentApplication={data} />
      )}
    </Container>
  );
}
