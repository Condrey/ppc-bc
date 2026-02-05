import { getApplicationInspections } from "@/components/application/action";
import ButtonAddInspection from "@/components/application/inspections/ppc-inspections/button-add-inspection";
import Container from "@/components/container";
import { TypographyH1, TypographyH2 } from "@/components/headings";
import { applicationTypes } from "@/lib/enums";
import { getApplicationNumber } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageClient } from "./page-client";

interface Props {
  params: Promise<{ applicationId: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { applicationId: decodedApplicationId } = await params;
  const applicationId = decodeURIComponent(decodedApplicationId);
  const application = await getApplicationInspections(applicationId);

  if (!application) {
    return {
      title: "404: Application not found",
    };
  }
  const { applicationNo, year, type } = application;
  const applicationNumber = getApplicationNumber(applicationNo, year, type);

  return { title: `${applicationNumber} inspections` };
};

export default async function Page({ params }: Props) {
  const { applicationId: decodedApplicationId } = await params;
  const applicationId = decodeURIComponent(decodedApplicationId);
  const application = await getApplicationInspections(applicationId);

  if (!application) return notFound();
  const { type, applicationNo, owners, id, year } = application;
  const { title } = applicationTypes[type];
  const applicationNumber = getApplicationNumber(applicationNo, year, type);

  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/admin" },
        { title: "Inspections", href: "/admin/inspections" },
        {
          title: "PPC inspections",
          href: "/admin/inspections/ppc-inspections",
        },
        {
          title: applicationNumber,
          href: `/admin/inspections/ppc-inspections/${applicationId}`,
        },
      ]}
    >
      <TypographyH1 text={owners} className="text-muted-foreground " />
      <TypographyH2
        text={`INSPECTIONS (${title})`}
        className="flex items-center flex-wrap justify-between"
      >
        <ButtonAddInspection
          applicationId={id}
          className="ms-auto max-w-fit w-full"
          variant={"secondary"}
        >
          <PlusIcon className="inline" /> new inspection
        </ButtonAddInspection>
      </TypographyH2>
      <PageClient application={application} />
    </Container>
  );
}
