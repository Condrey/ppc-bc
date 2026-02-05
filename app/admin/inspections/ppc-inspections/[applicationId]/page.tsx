import { getApplicationInspections } from "@/components/application/action";
import Container from "@/components/container";
import { TypographyH1, TypographyH2 } from "@/components/headings";
import { applicationTypes } from "@/lib/enums";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageClient } from "./page-client";

interface Props {
  params: Promise<{ applicationId: string }>;
}

export const metadata: Metadata = {
  title: "PPC Inspection",
};

export default async function Page({ params }: Props) {
  const { applicationId: decodedApplicationId } = await params;
  const applicationId = decodeURIComponent(decodedApplicationId);
  const application = await getApplicationInspections(applicationId);
  if (!application) return notFound();
  const { title } = applicationTypes[application.type];
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
          title: "Inspections",
          href: `/admin/inspections/ppc-inspections/${applicationId}`,
        },
      ]}
    >
      <TypographyH1
        text={application.owners}
        className="text-muted-foreground "
      />
      <TypographyH2 text={`INSPECTIONS (${title})`}></TypographyH2>
      <PageClient application={application} />
    </Container>
  );
}
