import Container from "@/components/container";
import DataTableLoadingSkeleton from "@/components/data-table/data-table-loading-skeleton";
import { Suspense } from "react";
import ComponentAbout from "./component-about";
import ComponentActs from "./component-acts";
import ComponentContacts from "./component-contacts";
import ComponentHeader from "./component-header";
import ComponentHero from "./component-hero";
import ComponentRequirements from "./component-requirements";
import Footer from "./footer";

export default function Home() {
  return (
    <div className="min-h-dvh overflow-y-auto scroll-auto flex flex-col gap-14">
      <ComponentHeader />
      <Container className="space-y-14 pt-0 text-center">
        <ComponentHero />
        <div className="gap-14 flex flex-col ">
          <ComponentRequirements />
          <div className="grid lg:grid-cols-2  gap-4 *:p-3 *:rounded-xl">
            <ComponentAbout />
            <ComponentActs />
          </div>
          <Suspense
            fallback={
              <DataTableLoadingSkeleton className="space-y-6 mx-auto max-w-4xl" />
            }
          >
            <ComponentContacts />
          </Suspense>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
