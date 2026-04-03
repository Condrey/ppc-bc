import { getAllParentApplications } from "@/components/application/parent-application/actions";
import ListOfPpaForm1s from "@/components/application/parent-application/ppaForm/list-of-ppa-forms";
import Container from "@/components/container";
import DataTableLoadingSkeleton from "@/components/data-table/data-table-loading-skeleton";
import { TypographyH1 } from "@/components/headings";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "All applications",
};

export default async function Page() {
  const applications = getAllParentApplications();

  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/admin" },
        { title: "Applications" },
      ]}
      ITEMS_TO_DISPLAY={2}
    >
      <TypographyH1 text="All applications" className="uppercase" />
      <Suspense fallback={<DataTableLoadingSkeleton />}>
        {applications.then((data) => (
          <ListOfPpaForm1s
            initialData={data}
            navigateToParent="/admin/applications/"
          />
        ))}
      </Suspense>
    </Container>
  );
}
