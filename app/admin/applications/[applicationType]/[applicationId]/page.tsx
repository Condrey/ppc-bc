import { getParentApplicationById } from "@/components/application/parent-application/actions";
import AllApplicationInfo from "@/components/application/parent-application/allApplicationInfo";
import Container from "@/components/container";
import { applicationTypes } from "@/lib/enums";
import { ApplicationType } from "@/lib/generated/prisma/enums";
import { getApplicationNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ applicationType: string; applicationId: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const {
    applicationType: decodedApplicationType,
    applicationId: decodedApplicationId,
  } = await params;
  const applicationType = decodeURIComponent(
    decodedApplicationType,
  ) as ApplicationType;
  const applicationId = decodeURIComponent(decodedApplicationId);
  const application = await getParentApplicationById(
    applicationId,
    applicationType,
  );
  if (!application)
    return {
      title: `Application not found`,
      description: `No application found for id ${applicationId}`,
    };
  const {
    application: {
      applicationNo,
      year,
      type,
      createdAt,
      applicant: { name },
    },
  } = application;
  const applicationNumber = getApplicationNumber(applicationNo, year, type);

  const { title: typeOfApplication } = applicationTypes[applicationType];
  return {
    title: `${applicationNumber} - ${typeOfApplication}`,
    description: `Showing ${applicationNumber} for ${typeOfApplication} submitted by ${name} on ${formatDate(createdAt, "PPPPp")}`,
  };
};

export default async function Page({ params }: Props) {
  const {
    applicationType: decodedApplicationType,
    applicationId: decodedApplicationId,
  } = await params;
  const applicationType = decodeURIComponent(
    decodedApplicationType,
  ) as ApplicationType;
  const applicationId = decodeURIComponent(decodedApplicationId);
  const application = await getParentApplicationById(
    applicationId,
    applicationType,
  );
  if (!application) return notFound();
  const {
    application: { applicationNo, year, type },
  } = application;
  const applicationNumber = getApplicationNumber(applicationNo, year, type);
  const { title: typeOfApplication } = applicationTypes[applicationType];

  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/admin" },
        { title: "Applications", href: "/admin/applications" },
        {
          title: `${typeOfApplication}s`,
          href: `/admin/applications/${applicationType}`,
        },
        { title: `${applicationNumber}` },
      ]}
    >
      <AllApplicationInfo parentApplication={application} />
    </Container>
  );
}
