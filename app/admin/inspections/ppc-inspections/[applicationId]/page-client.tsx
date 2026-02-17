"use client";

import { getApplicationInspections } from "@/components/application/action";
import ButtonEditBuildingInspection from "@/components/application/inspections/ppc-inspections/parent-application/button-edit-building-inspection";
import ButtonEditLandInspection from "@/components/application/inspections/ppc-inspections/parent-application/button-edit-land-inspection";
import SectionHeader from "@/components/application/inspections/ppc-inspections/section-header";
import SectionInspectionBody from "@/components/application/inspections/ppc-inspections/section-inpection-body";
import { TypographyH4 } from "@/components/headings";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { applicationDecisions } from "@/lib/enums";
import {
  ApplicationDecision,
  ApplicationType,
} from "@/lib/generated/prisma/enums";
import { ApplicationData } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";

interface Props {
  application: ApplicationData;
}
export function PageClient({ application: initialData }: Props) {
  const query = useQuery({
    queryKey: ["inspection", "applicationId", initialData.id],
    queryFn: () => getApplicationInspections(initialData.id),
    initialData,
  });
  const { data: application, status } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage="Failed to fetch inspections"
        query={query}
      />
    );
  }
  if (!application) {
    return (
      <EmptyContainer
        title="404-Not Found"
        description="Please check your url and try again"
      />
    );
  }
  const { inspections, type, landApplication, buildingApplication } =
    application;
  const numberOfInspections = inspections.length;
  const manyInspections = numberOfInspections > 3;
  const isLandApplication = type === ApplicationType.LAND;
  return (
    <Tabs
      defaultValue={inspections[0].id}
      orientation={manyInspections ? "vertical" : "horizontal"}
      className="gap-6"
    >
      <div className="">
        <TypographyH4
          text={`${formatNumber(numberOfInspections)} inspection${numberOfInspections === 1 ? "" : "s"}`}
          className="text-muted-foreground"
        />
        {numberOfInspections > 1 && (
          <TabsList className={cn(manyInspections ? "min-w-xs" : " w-full")}>
            {inspections.map((i) => (
              <TabsTrigger key={i.id} value={i.id}>
                {formatDate(i.carriedOn, "PP")}
              </TabsTrigger>
            ))}
          </TabsList>
        )}
      </div>
      {inspections.map((i) => {
        const { decision } = i;
        const { title: decisionMade } = applicationDecisions[decision];

        return (
          <TabsContent
            key={i.id}
            value={i.id}
            className={cn("space-y-8", manyInspections && "border-s ps-6")}
          >
            {/* header  */}
            <div className="flex items-center justify-between">
              <TypographyH4
                text={`[Decision ${decisionMade}]`}
                className={cn(
                  "font-black capitalize animate-pulse",
                  decision === ApplicationDecision.DEFERRED ||
                    decision === ApplicationDecision.REJECTED
                    ? "text-destructive"
                    : decision === ApplicationDecision.PENDING
                      ? "text-warning"
                      : "text-success",
                )}
              />
              {isLandApplication ? (
                <ButtonEditLandInspection
                  inspection={i}
                  landApplication={landApplication!}
                >
                  Update inspection
                </ButtonEditLandInspection>
              ) : (
                <ButtonEditBuildingInspection
                  inspection={i}
                  buildingApplication={buildingApplication!}
                >
                  Update inspection
                </ButtonEditBuildingInspection>
              )}
            </div>
            <SectionHeader application={application} />
            <SectionInspectionBody application={application} inspection={i} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
