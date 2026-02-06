import { getAllParentApplications } from "@/components/application/parent-application/actions";
import { ListOfFeesAssessments } from "@/components/application/parent-application/fees-assessment/list-of-fees-assessments";
import Container from "@/components/container";
import { TypographyH1 } from "@/components/headings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All fees assessments",
};

export default async function Page() {
  const users = await getAllParentApplications();

  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/" },
        { title: "Fees assessments", href: "/fees-assessments" },
      ]}
      ITEMS_TO_DISPLAY={2}
    >
      <TypographyH1 text="All fees assessments" className="uppercase" />
      <ListOfFeesAssessments initialData={users} />
    </Container>
  );
}
