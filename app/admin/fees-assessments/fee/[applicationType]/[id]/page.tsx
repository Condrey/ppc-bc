import { getParentApplicationById } from "@/components/application/parent-application/actions";
import { ApplicationType } from "@/lib/generated/prisma/enums";
import { getApplicationNumber } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageClient from "./page-client";

interface Props {
  params: Promise<{ id: string; applicationType: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: encodedId, applicationType: encodedApplicationType } =
    await params;
  const id = decodeURIComponent(encodedId);
  const applicationType = decodeURIComponent(
    encodedApplicationType,
  ) as ApplicationType;

  const parentApplication = await getParentApplicationById(id, applicationType);
  if (!parentApplication)
    return {
      title: "Fee Assessment Not Found",
      description: "The item you are looking for does not exist.",
    };
  const {
    application: { applicationNo, year, type },
  } = parentApplication;
  const applicationNumber = getApplicationNumber(applicationNo, year, type);

  return {
    title: `${applicationNumber} - Fee Assessment`,
    description: `Viewing fees assessments for ${applicationNumber}.`,
  };
}

export default async function Page({ params }: Props) {
  const { id: encodedId, applicationType: encodedApplicationType } =
    await params;
  const id = decodeURIComponent(encodedId);
  const applicationType = decodeURIComponent(
    encodedApplicationType,
  ) as ApplicationType;

  const parentApplication = await getParentApplicationById(id, applicationType);
  if (!parentApplication) notFound();

  return (
    <PageClient
      initialData={parentApplication}
      applicationType={applicationType}
    />
  );
}
