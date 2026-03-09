"use client";

import ApplicantAvatar from "@/components/applicant-avatar";
import { TypographyH4 } from "@/components/headings";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { applicationStatuses, applicationTypes } from "@/lib/enums";
import { ParentApplicationData } from "@/lib/types";
import { getApplicationNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { HistoryIcon, MapPinIcon, PlusIcon } from "lucide-react";
import { DataTable } from "../../../data-table/data-table";
import { EmptyContainer } from "../../../query-container/empty-container";
import ErrorContainer from "../../../query-container/error-container";
import { useParentApplicationsQuery } from "../query";
import ButtonAddEditPpaForm1 from "./button-add-edit-ppa-form1";
import { usePpaForm1Columns } from "./columns";

export default function ListOfPpaForm1s({
  initialData,
}: {
  initialData: ParentApplicationData[];
}) {
  const query = useParentApplicationsQuery(initialData);
  const { data: parentApplications, status } = query;

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
    <DataTable
      data={[
        ...parentApplications,
        ...parentApplications,
        ...parentApplications,
        ...parentApplications,
        ...parentApplications,
      ].map((a, index) => ({ ...a, id: index + a.id }))}
      columns={usePpaForm1Columns}
      filterColumn={{
        id: "application_applicant_name",
        label: "applicant",
      }}
      tableHeaderSection={
        <TypographyH4 text="Applications for Development Permit" />
      }
      className="w-full"
      cardRenderer={(item) => {
        const {
          address: { cell, district, village, subCounty, parish },
          application: {
            applicationNo,
            year,
            type,
            status,
            createdAt,
            applicant: {
              name,
              user: { avatarUrl },
            },
          },
        } = item;
        const { title: applicationType } = applicationTypes[type];
        const { title: applicationStatus, variant } =
          applicationStatuses[status];
        const location = `${cell ? `${cell} cell, ` : ""}${village ? `${village} village, ` : ""}${parish ? `${parish} parish, ` : ""}${subCounty ? `${subCounty}, ` : ""} ${district}`;

        const applicationNumber = getApplicationNumber(
          applicationNo,
          year,
          type,
        );
        return (
          <Item size={"sm"} variant={"muted"}>
            <ItemHeader>
              <div className="flex gap-2">
                <ApplicantAvatar
                  avatarUrl={avatarUrl}
                  name={name}
                  avatarSize={"40px"}
                />
                <div>
                  <ItemTitle>{applicationType}</ItemTitle>
                  <ItemDescription>{applicationNumber}</ItemDescription>
                </div>
              </div>
              <Badge variant={variant}>{applicationStatus}</Badge>
            </ItemHeader>
            <ItemContent>
              <p className="line-clamp-1 text-muted-foreground">
                <MapPinIcon className="inline size-5 mr-1 fill-muted text-muted-foreground" />
                {location}
              </p>
            </ItemContent>
            <ItemFooter>
              <p className="line-clamp-1">
                <span className="italic text-muted-foreground">by</span> {name}
              </p>
              <span className="block flex-none">
                <HistoryIcon className="inline size-4 mr-1" />
                {formatDate(createdAt, "PP")}
              </span>
            </ItemFooter>
          </Item>
        );
      }}
    >
      <ButtonAddEditPpaForm1 size={"sm"} variant={"secondary"}>
        <PlusIcon /> New
      </ButtonAddEditPpaForm1>
    </DataTable>
  );
}
