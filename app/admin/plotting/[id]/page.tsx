import { getApplicationById } from "@/components/application/parent-application/actions";
import { getApplicationNumber } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PageClient from "./page-client";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: encodedId } = await params;
  const id = decodeURIComponent(encodedId);
  const application = await getApplicationById(id);

  if (!application) {
    return {
      title: "404 - Application not found",
      description:
        "This resource has been removed or changed to another location.",
    };
  }
  const { applicationNo, year, type } = application;
  const applicationNumber = getApplicationNumber(applicationNo, year, type);
  return {
    title: `${applicationNumber} Plotting and parcel`,
    description: `Plotting and parcel for application registered with application number ${applicationNumber}`,
  };
}

export default async function Page({ params }: Props) {
  const { id: encodedId } = await params;
  const id = decodeURIComponent(encodedId);
  const application = await getApplicationById(id);

  if (!application) return notFound();

  return (
    <Suspense>
      <PageClient application={application} />
    </Suspense>
  );
}
