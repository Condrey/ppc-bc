import { getAllParentApplicationsByApplicationType } from "@/components/application/parent-application/actions";
import ButtonAddEditPpaForm1 from "@/components/application/parent-application/ppaForm/button-add-edit-ppa-form1";
import ListOfPpaForm1s from "@/components/application/parent-application/ppaForm/list-of-ppa-forms";
import Container from "@/components/container";
import { TypographyH2 } from "@/components/headings";
import { applicationTypes } from "@/lib/enums";
import { ApplicationType } from "@/lib/generated/prisma/enums";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";

interface Props {
  params: Promise<{ applicationType: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { applicationType: decodedApplicationType } = await params;
  const applicationType = decodeURIComponent(
    decodedApplicationType,
  ) as ApplicationType;
  const applications =
    await getAllParentApplicationsByApplicationType(applicationType);

  const { title } = applicationTypes[applicationType];
  return {
    title: `${title} applications`,
    description: `Showing ${applications.length} for ${title}`,
  };
};

export default async function Page({ params }: Props) {
  const { applicationType: decodedApplicationType } = await params;
  const applicationType = decodeURIComponent(
    decodedApplicationType,
  ) as ApplicationType;
  const applications =
    await getAllParentApplicationsByApplicationType(applicationType);
  const { title } = applicationTypes[applicationType];

  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/admin" },
        { title: "Applications", href: "/admin/applications" },
        { title: `${title}` },
      ]}
    >
      <TypographyH2
        text={`${title}s`}
        className="flex items-center flex-wrap justify-between"
      >
        <ButtonAddEditPpaForm1>
          <PlusIcon className="inline" /> New application
        </ButtonAddEditPpaForm1>
      </TypographyH2>
      <ListOfPpaForm1s
        initialData={applications}
        applicationType={applicationType}
      />
    </Container>
  );
}
