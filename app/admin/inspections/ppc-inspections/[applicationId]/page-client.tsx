"use client";

import { getApplicationInspections } from "@/components/application/action";
import ButtonEditBuildingInspection from "@/components/application/inspections/ppc-inspections/parent-application/button-edit-building-inspection";
import ButtonEditLandInspection from "@/components/application/inspections/ppc-inspections/parent-application/button-edit-land-inspection";
import SectionHeader from "@/components/application/inspections/ppc-inspections/section-header";
import { TypographyH3, TypographyH4 } from "@/components/headings";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  applicationDecisions,
  landUseTypes,
  naturesOfInterestInLand,
  roles,
} from "@/lib/enums";
import {
  ApplicationDecision,
  ApplicationType,
  LandUseType,
  NatureOfInterestInLand,
} from "@/lib/generated/prisma/enums";
import { ApplicationData } from "@/lib/types";
import { cn, formatNumber, getApplicationNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { AlertTriangle } from "lucide-react";

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
  const {
    inspections,
    applicationNo,
    year,
    type,
    landApplication,
    buildingApplication,
    owners,
  } = application;
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
        const { carriedOn, decision, visitReport, inspectors } = i;
        const { title: decisionMade } = applicationDecisions[decision];
        const fieldClassName =
          "flex-1 text-muted-foreground min-h-9 h-auto bg-muted text-xl font-semibold font-sans outline inline h-9 w-auto min-w-sm rounded-md p-1";
        const checkboxClassName = "size-8 border-foreground *:[&_svg]:size-8";
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
            <div
              className={cn(
                "max-w-4xl mx-auto space-y-8",
                manyInspections && "max-w-none",
              )}
            >
              <p className="max-w-prose tracking-wide leading-loose text-justify hyphens-auto">
                <span className="max-w-prose">
                  This inspection was carried out on{" "}
                  <strong>{formatDate(carriedOn, "PPPp")}.</strong>
                </span>
                <span className="max-w-prose inline">
                  {" "}
                  The decision made by the inspectors is that the application{" "}
                  {getApplicationNumber(applicationNo, year, type)}{" "}
                  <strong
                    className={cn(
                      "",
                      (decision === ApplicationDecision.DEFERRED ||
                        decision === ApplicationDecision.REJECTED) &&
                        "text-destructive",
                    )}
                  >
                    {decisionMade}.
                  </strong>
                </span>
              </p>
              {!visitReport ? (
                <EmptyContainer
                  title="Incomplete inspection"
                  description="Please not that the inspection is not complete and pending "
                  icon={AlertTriangle}
                  className="bg-destructive/5 animate-pulse [&_svg]:fill-destructive max-w-md mx-auto"
                  required
                >
                  {isLandApplication ? (
                    <ButtonEditLandInspection
                      variant={"destructive"}
                      inspection={i}
                      landApplication={landApplication!}
                    >
                      Complete inspection
                    </ButtonEditLandInspection>
                  ) : (
                    <ButtonEditBuildingInspection
                      variant={"destructive"}
                      inspection={i}
                      buildingApplication={buildingApplication!}
                    >
                      Complete inspection
                    </ButtonEditBuildingInspection>
                  )}
                </EmptyContainer>
              ) : (
                <div className="space-y-2.5 max-w-3xl">
                  <div className="space-y-2.5">
                    <p className='flex items-center gap-2 flex-wrap before:content-["Owner(s):_"]'>
                      <span className={fieldClassName}>{owners}</span>
                    </p>
                    <p className='flex items-center gap-2 flex-wrap before:content-["Inspection_date:_"]'>
                      <span className={fieldClassName}>
                        {formatDate(carriedOn, "PPPPp")}
                      </span>
                    </p>
                  </div>
                  {isLandApplication ? (
                    <>
                      <div className="space-y-2.5">
                        <p className='flex items-center gap-2 flex-wrap before:content-["Nature_of_interest_on_the_land:_"]'>
                          <span className={fieldClassName}>
                            {
                              naturesOfInterestInLand[
                                landApplication?.natureOfInterest ??
                                  NatureOfInterestInLand.FREEHOLD
                              ].title
                            }
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["Size_of_the_land:_"]'>
                          <span className={fieldClassName}>
                            {landApplication?.address.size},{" "}
                            {landApplication?.landUse.acreage}
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["Current_use_of_site_and_surrounding:_"]'>
                          <span className={fieldClassName}>
                            {landApplication?.site?.currentUseAndSurrounding}
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["Land_use_type:_"]'>
                          <span className={fieldClassName}>
                            {
                              landUseTypes[
                                landApplication?.landUse.landUseType ??
                                  LandUseType.RESIDENTIAL
                              ].title
                            }
                          </span>
                        </p>
                        {landApplication?.landUse.landUseType ===
                          LandUseType.OTHERS && (
                          <p className='flex items-center gap-2 flex-wrap before:content-["Other_land_use_type:_"]'>
                            <span className={fieldClassName}>
                              {landApplication.landUse.otherLandUseType}
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="space-y-2.5 mt-6">
                        <h3 className="font-bold text-xl tracking-tight">
                          Distance in Meters
                        </h3>
                        <p className='flex items-center gap-2 flex-wrap before:content-["From_highway/road:_"]'>
                          <span className={fieldClassName}>
                            {
                              landApplication?.site?.distanceFromFeatures
                                ?.fromRoad
                            }
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["From_wetland:_"]'>
                          <span className={fieldClassName}>
                            {
                              landApplication?.site?.distanceFromFeatures
                                ?.fromWetland
                            }
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["From_forest_reserve:_"]'>
                          <span className={fieldClassName}>
                            {
                              landApplication?.site?.distanceFromFeatures
                                ?.fromReserve
                            }
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["From_Green_Belt:_"]'>
                          <span className={fieldClassName}>
                            {
                              landApplication?.site?.distanceFromFeatures
                                ?.fromGreenBelt
                            }
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["From_High_Volt_Power_Line:_"]'>
                          <span className={fieldClassName}>
                            {
                              landApplication?.site?.distanceFromFeatures
                                ?.fromPowerLine
                            }
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["From_Sewerage_Lagoon:_"]'>
                          <span className={fieldClassName}>
                            {
                              landApplication?.site?.distanceFromFeatures
                                ?.fromLagoon
                            }
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["From_Rock/Hills:_"]'>
                          <span className={fieldClassName}>
                            {
                              landApplication?.site?.distanceFromFeatures
                                ?.fromHills
                            }
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["From_Others:_"]'>
                          <span className={fieldClassName}>
                            {
                              landApplication?.site?.distanceFromFeatures
                                ?.fromOthers
                            }
                          </span>
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2.5">
                        <p className='flex items-center gap-2 flex-wrap before:content-["Proof_of_land_ownership:_"]'>
                          <span className={fieldClassName}>
                            {
                              naturesOfInterestInLand[
                                buildingApplication?.natureOfInterest ??
                                  NatureOfInterestInLand.FREEHOLD
                              ].title
                            }
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["Size_of_the_land:_"]'>
                          <span className={fieldClassName}>
                            {buildingApplication?.address.size}
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["Current_use_of_site_and_surrounding:_"]'>
                          <span className={fieldClassName}>
                            {
                              buildingApplication?.site
                                ?.currentUseAndSurrounding
                            }
                          </span>
                        </p>
                        <div className="space-y-2.5 mt-6">
                          <h3 className="font-bold text-xl tracking-tight">
                            Has access for(to):
                          </h3>
                          <Label>
                            <Checkbox
                              checked={buildingApplication?.access?.pedestrian}
                              className={checkboxClassName}
                              disabled
                            />{" "}
                            <span>Pedestrian</span>
                          </Label>
                          <Label>
                            <Checkbox
                              checked={buildingApplication?.access?.vehicular}
                              className={checkboxClassName}
                              disabled
                            />{" "}
                            <span>Vehicular</span>
                          </Label>
                          <Label>
                            <Checkbox
                              checked={
                                buildingApplication?.access
                                  ?.openAccessForNeighbors
                              }
                              className={checkboxClassName}
                              disabled
                            />{" "}
                            <span>Open access for neighbors</span>
                          </Label>
                          <Label>
                            <Checkbox
                              checked={
                                buildingApplication?.access?.existingPath
                              }
                              className={checkboxClassName}
                              disabled
                            />{" "}
                            <span>ExistingPath</span>
                          </Label>
                          <Label>
                            <Checkbox
                              checked={buildingApplication?.access?.structures}
                              className="size-8 border-foreground *:[&_svg]:size-8"
                              disabled
                            />{" "}
                            <span>Structures and fence</span>
                          </Label>
                        </div>
                        <p className='flex items-center gap-2 flex-wrap before:content-["Size/_scale_of_available_space_for_building(%):_"]'>
                          <span className={fieldClassName}>
                            {
                              buildingApplication?.site
                                ?.percentageSizeOfBuildingAvailableSpace
                            }
                          </span>
                        </p>
                      </div>
                      <div className="space-y-2.5 mt-6">
                        <h3 className="font-bold text-xl tracking-tight">
                          Presence of utility and infrastructures:
                        </h3>
                        <Label>
                          <Checkbox
                            checked={buildingApplication?.site?.hasElectricity}
                            className={checkboxClassName}
                            disabled
                          />{" "}
                          <span>National water</span>
                        </Label>
                        <Label>
                          <Checkbox
                            checked={buildingApplication?.site?.hasElectricity}
                            className={checkboxClassName}
                            disabled
                          />{" "}
                          <span>Electricity</span>
                        </Label>
                      </div>
                      <div className="space-y-2.5 mt-6">
                        <h3 className="font-bold text-xl tracking-tight">
                          Orientation analysis:
                        </h3>
                        <p className='flex items-center gap-2 flex-wrap before:content-["Sun_direction:_"]'>
                          <span className={fieldClassName}>
                            {buildingApplication?.site?.sunDirection}
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["Prevailing_winds:_"]'>
                          <span className={fieldClassName}>
                            {buildingApplication?.site?.prevailingWinds}
                          </span>
                        </p>
                      </div>
                      <div className="space-y-2.5">
                        <p className='flex items-center gap-2 flex-wrap before:content-["Land_use_type:_"]'>
                          <span className={fieldClassName}>
                            {buildingApplication?.landUse.landUseType}
                          </span>
                        </p>
                        {buildingApplication?.landUse.landUseType ===
                          LandUseType.OTHERS && (
                          <p className='flex items-center gap-2 flex-wrap before:content-["Other_land_use_type:_"]'>
                            <span className={fieldClassName}>
                              {buildingApplication.landUse.otherLandUseType}
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="space-y-2.5 mt-6">
                        <h3 className="font-bold text-xl tracking-tight">
                          Distance in Meters
                        </h3>
                        <p className='flex items-center gap-2 flex-wrap before:content-["From_highway/road:_"]'>
                          <span className={fieldClassName}>
                            {
                              buildingApplication?.site?.distanceFromFeatures
                                ?.fromRoad
                            }
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["From_wetland:_"]'>
                          <span className={fieldClassName}>
                            {
                              buildingApplication?.site?.distanceFromFeatures
                                ?.fromWetland
                            }
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["From_forest_reserve:_"]'>
                          <span className={fieldClassName}>
                            {
                              buildingApplication?.site?.distanceFromFeatures
                                ?.fromReserve
                            }
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["From_Green_Belt:_"]'>
                          <span className={fieldClassName}>
                            {
                              buildingApplication?.site?.distanceFromFeatures
                                ?.fromGreenBelt
                            }
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["From_High_Volt_Power_Line:_"]'>
                          <span className={fieldClassName}>
                            {
                              buildingApplication?.site?.distanceFromFeatures
                                ?.fromPowerLine
                            }
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["From_Sewerage_Lagoon:_"]'>
                          <span className={fieldClassName}>
                            {
                              buildingApplication?.site?.distanceFromFeatures
                                ?.fromLagoon
                            }
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["From_Rock/Hills:_"]'>
                          <span className={fieldClassName}>
                            {
                              buildingApplication?.site?.distanceFromFeatures
                                ?.fromHills
                            }
                          </span>
                        </p>
                        <p className='flex items-center gap-2 flex-wrap before:content-["From_Others:_"]'>
                          <span className={fieldClassName}>
                            {
                              buildingApplication?.site?.distanceFromFeatures
                                ?.fromOthers
                            }
                          </span>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
              {!!visitReport && (
                <div className="max-w-prose">
                  <TypographyH3 text="Visit Report" className="underline" />
                  <TipTapViewer content={visitReport} />
                </div>
              )}
              {!!inspectors.length && (
                <div>
                  <TypographyH3 text="Inspectors" className="underline" />
                  <ol className="list-decimal lining-nums list-inside">
                    {inspectors.map(({ name, role }, index) => {
                      const { title } = roles[role];
                      return (
                        <li key={index}>
                          {name} - <strong>{title}</strong>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
