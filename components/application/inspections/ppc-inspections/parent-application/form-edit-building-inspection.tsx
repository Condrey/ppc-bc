import AddressSection from "@/components/application/parent-application/ppaForm/form-components/address-section";
import { Button } from "@/components/ui/button";
import { Form, FormFooter } from "@/components/ui/form";
import LoadingButton from "@/components/ui/loading-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  GeoJSONType,
  InspectionBuildingApplicationData,
  InspectionData,
} from "@/lib/types";
import {
  ParentApplicationSchema,
  parentApplicationSchema,
  SiteSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useEditBuildingInspectionMutation } from "../mutations";
import AccessSection from "./form-components/access-section";
import ApplicantSection from "./form-components/applicant-section";
import DistanceSection from "./form-components/distance-section";
import InspectorsSection from "./form-components/inspectors-section";
import LandUseSection from "./form-components/land-use-section";
import VisitReportSection from "./form-components/visit-report-section";

interface Props {
  inspection: InspectionData;
  buildingApplication: InspectionBuildingApplicationData;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}
export default function FormAddEditBuildingInspection({
  inspection,
  buildingApplication,
  open,
  onOpenChange,
}: Props) {
  const {
    id: applicationId,
    site,
    application: { applicant },
    access,
  } = buildingApplication;
  const form = useForm<ParentApplicationSchema>({
    resolver: zodResolver(parentApplicationSchema),
    values: {
      ...buildingApplication,
      site: {
        ...site,
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        distanceFromFeatures: site?.distanceFromFeatures!,
      } as SiteSchema,
      inspection: {
        id: inspection.id,
        applicationId: applicationId || inspection.applicationId,
        carriedOn: inspection.carriedOn,
        visitReport: inspection.visitReport,
        decision: inspection.decision,
        inspectorsIds:
          inspection.inspectors.map((i) => ({ userId: i.id })) || [],
      },
      access: access ?? {
        existingPath: false,
        fence: false,
        pedestrian: false,
        openAccessForNeighbors: false,
        structures: false,
        vehicular: false,
      },
      parcel: {
        ...buildingApplication.parcel,
        geometry:
          (buildingApplication.parcel?.geometry as GeoJSONType) || undefined,
        blockNumber: buildingApplication.parcel?.blockNumber || "",
        plotNumber: buildingApplication.parcel?.plotNumber || "",
      },
    },
  });
  const { mutate, isPending } = useEditBuildingInspectionMutation();

  function submitForm(input: ParentApplicationSchema) {
    mutate(
      { buildingApplication: input },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      },
    );
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" className=" overflow-y-auto scroll-smooth h-dvh">
        <div className="max-w-7xl space-y-6 mx-auto w-full  ">
          <SheetHeader className="w-full">
            <SheetTitle>Complete Inspection</SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submitForm)}>
              {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <ApplicantSection form={form} applicant={applicant} />
                  <LandUseSection form={form} />
                  <InspectorsSection form={form} />
                </div>
                <div className="space-y-6">
                  <AddressSection form={form} shouldWrap />
                  <DistanceSection form={form} shouldWrap />
                  <AccessSection form={form} shouldWrap />
                  <VisitReportSection form={form} />
                </div>
              </div>
            </form>
            <div className="space-y-6 p-3 w-fit md:w-lg lg:w-3xl">
              <FormFooter className="mt-6">
                <Button
                  onClick={() => form.reset()}
                  type="button"
                  size={"lg"}
                  variant={"outline"}
                >
                  Reset Form
                </Button>
                <LoadingButton
                  type="button"
                  loading={isPending}
                  size={"lg"}
                  onClick={() => form.handleSubmit(submitForm)()}
                >
                  {inspection ? "Update inspection" : "Create inspection"}
                </LoadingButton>
              </FormFooter>
            </div>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
