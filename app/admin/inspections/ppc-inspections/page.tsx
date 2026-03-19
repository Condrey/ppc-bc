import ListOfPpcInspectionApplications from "@/components/application/inspections/ppc-inspections/list-of-ppc-inspection-applications";
import { getAllParentApplications } from "@/components/application/parent-application/actions";
import Container from "@/components/container";
import { TypographyH2 } from "@/components/headings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PPC inspections",
};
export default async function Page() {
  const ladApplications = await getAllParentApplications();
  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/admin" },
        { title: "Inspections", href: "/admin/inspections" },
        {
          title: "PPC inspections",
        },
      ]}
    >
      <TypographyH2
        text="PPC inspections"
        className="flex justify-between items-center"
      ></TypographyH2>
      <ListOfPpcInspectionApplications initialData={ladApplications} />
    </Container>
  );
}
