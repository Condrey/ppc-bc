"use client";

import { TypographyH4 } from "@/components/headings";
import SearchContainer from "@/components/search-container";
import { useIsMobile } from "@/hooks/use-mobile";
import { ParentApplicationData } from "@/lib/types";
import { PlusIcon } from "lucide-react";
import { DataTable } from "../../../data-table/data-table";
import { EmptyContainer } from "../../../query-container/empty-container";
import ErrorContainer from "../../../query-container/error-container";
import { useParentApplicationsQuery } from "../query";
import ButtonAddEditPpaForm1 from "./button-add-edit-ppa-form1";
import { usePpaForm1Columns } from "./columns";
import { useMemo, useState } from "react";
import { MOBILE_MAX_ITEMS } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

export default function ListOfPpaForm1s({
  initialData,
}: {
  initialData: ParentApplicationData[];
}) {

  const query = useParentApplicationsQuery(initialData);
  const isMobile = useIsMobile();
  const { data: parentApplications, status } = query;

   const search =  useSearchParams().get('query')||''
   const [visibleCount, setVisibleCount] = useState(MOBILE_MAX_ITEMS);
const filtered = useMemo(() => {
    if (!parentApplications) return [];

    return parentApplications.filter((item) =>
      item.application.applicant.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [parentApplications, search]);

  useInfiniteScroll(() => {
    if (isMobile) {
      setVisibleCount((v) => v + MOBILE_MAX_ITEMS);
    }
  });

  if (status === "error") {
    return (
      <ErrorContainer errorMessage="Failed to fetch PPA1 forms" query={query} />
    );
  }
  if (!parentApplications.length) {
    return (
      <EmptyContainer
        title="Empty data"
        description="There are currently no PPA1 forms in the database. Please add"
      >
        <ButtonAddEditPpaForm1>Add new PPA Form1</ButtonAddEditPpaForm1>
      </EmptyContainer>
    );
  }
  return (
    <>
      {isMobile ? (
        <>
          <SearchContainer placeholder="search by applicant" />
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.slice(0,visibleCount).map((item) => (
              <div key={item.id}>{item.application.applicant.name}</div>
            ))}
            <div id="load-more" />
          </div>
        </>
      ) : (
        <DataTable
          data={parentApplications}
          columns={usePpaForm1Columns}
          filterColumn={{
            id: "application_applicant_name",
            label: "applicant",
          }}
          tableHeaderSection={
            <TypographyH4 text="Applications for Development Permit" />
          }
          className="w-full"
        >
          <ButtonAddEditPpaForm1 size={"sm"} variant={"secondary"}>
            <PlusIcon /> New
          </ButtonAddEditPpaForm1>
        </DataTable>
      )}
    </>
  );
}
