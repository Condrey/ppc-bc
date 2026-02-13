import { getAllParentApplications } from "@/components/application/parent-application/actions";
import ListOfPpaForm1s from "@/components/application/parent-application/ppaForm/list-of-ppa-forms";
import Container from "@/components/container";
import { TypographyH1 } from "@/components/headings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All applications",
};

export default async function Page() {
  const users = await getAllParentApplications();

  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/" },
        { title: "Applications", href: "/applications" },
      ]}
      ITEMS_TO_DISPLAY={2}
    >
      <TypographyH1 text="All applications" className="uppercase" />
      <ListOfPpaForm1s initialData={users} />
    </Container>
  );
}
