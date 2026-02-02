import ListOfPpcInspectionApplications from "@/components/application/inspections/ppc-incpections/list-of-ppc-inspection-applications";
import { getAllLandApplications } from "@/components/application/land-application/actions";
import Container from "@/components/container";
import { TypographyH2 } from "@/components/headings";

export default async function Page() {
  const ladApplications = await getAllLandApplications();
  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/admin" },
        { title: "Inspections", href: "/admin/inspections" },
        {
          title: "PPC inspections",
          href: "/admin/inspections/ppc-inspections",
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
