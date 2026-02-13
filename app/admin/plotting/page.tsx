import { getAllParentApplications } from "@/components/application/parent-application/actions";
import ListOfParcels from "@/components/application/plotting/list-of-parcels";
import Container from "@/components/container";
import { TypographyH2 } from "@/components/headings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parcels and Plotting",
};
export default async function Page() {
  const parentApplications = await getAllParentApplications();
  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/admin" },
        { title: "Parcels and Plotting", href: "/admin/plotting" },
      ]}
      ITEMS_TO_DISPLAY={2}
    >
      <TypographyH2
        text="Parcels and Plotting"
        className="flex justify-between items-center"
      ></TypographyH2>
      <ListOfParcels initialData={parentApplications} />
    </Container>
  );
}
