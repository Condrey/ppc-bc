import AddressSection from "@/components/application/land-application/ppaForm/form-components/address-section";
import { Button } from "@/components/ui/button";
import { Form, FormFooter } from "@/components/ui/form";
import LoadingButton from "@/components/ui/loading-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { InspectionData, InspectionLandApplicationData } from "@/lib/types";
import {
  LandApplicationSchema,
  landApplicationSchema,
  SiteSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useEditLandInspectionMutation } from "../mutations";
import ApplicantSection from "./form-components/applicant-section";
import DistanceSection from "./form-components/distance-section";
import InspectorsSection from "./form-components/inspectors-section";
import LandUseSection from "./form-components/land-use-section";
import VisitReportSection from "./form-components/visit-report-section";

interface Props {
  inspection: InspectionData;
  landApplication: InspectionLandApplicationData;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}
export default function FormAddEditLandInspection({
  inspection,
  landApplication,
  open,
  onOpenChange,
}: Props) {
  const {
    id: applicationId,
    site,
    application: { applicant },
  } = landApplication;
  const form = useForm<LandApplicationSchema>({
    resolver: zodResolver(landApplicationSchema),
    values: {
      ...landApplication,
      site: {
        ...site,
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        distanceFromFeatures: site?.distanceFromFeatures!,
      } as SiteSchema,
      inspection: {
        id: inspection.id,
        applicationId,
        carriedOn: inspection.carriedOn,
        visitReport: inspection.visitReport,
        decision: inspection.decision,
        inspectorsIds:
          inspection.inspectors.map((i) => ({ userId: i.id })) || [],
      },
    },
  });
  const { mutate, isPending } = useEditLandInspectionMutation();

  function submitForm(input: LandApplicationSchema) {
    mutate(
      { landApplication: input },
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
