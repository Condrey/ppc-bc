/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormFooter } from "@/components/ui/form";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import LoadingButton from "@/components/ui/loading-button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ApplicationStatus,
  ApplicationType,
} from "@/lib/generated/prisma/enums";
import { BuildingApplicationData, GeoJSONType } from "@/lib/types";
import {
  ApplicationSchema,
  LandUseSchema,
  ParcelSchema,
  ParentApplicationSchema,
  parentApplicationSchema,
  PpaForm1Schema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { getAllApplicants } from "../application/applicant/actions";
import ButtonAddEditApplicant from "../application/applicant/button-add-edit-applicant";
import AddressSection from "./form-components/address-section";
import ApplicantSection from "./form-components/applicant-section";
import ApplicationSection from "./form-components/application-section";
import LandUseSection from "./form-components/land-use-section";
import UtilitySection from "./form-components/utility-section";
import { useUpsertPpaForm1BuildingApplicationMutation } from "./mutations";

interface Props {
  buildingApplication?: BuildingApplicationData;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}
export default function FormAddEditPpaForm1BuildingApplication({
  buildingApplication,
  open,
  onOpenChange,
}: Props) {
  const currentYear = new Date().getFullYear();
  const form = useForm<ParentApplicationSchema>({
    resolver: zodResolver(parentApplicationSchema),
    values: {
      id: buildingApplication?.id || "",
      application:
        buildingApplication?.application ||
        ({
          year: currentYear,
          type: ApplicationType.BUILDING,
          status: ApplicationStatus.SUBMITTED,
        } as ApplicationSchema),
      natureOfInterest: buildingApplication?.natureOfInterest!,
      address: buildingApplication?.address || {
        district: "Lira City",
      },
      ppaForm1:
        buildingApplication?.ppaForm1 ||
        ({
          shouldHaveNewRoadAccess: false,
          year: currentYear,
        } as PpaForm1Schema),
      landUse:
        buildingApplication?.landUse ||
        ({
          doesItAbutRoadJunction: false,
          doesNotInvolveBuilding: false,
        } as LandUseSchema),
      site: buildingApplication?.site || {
        hasElectricity: false,
        hasNationalWater: false,
      },
      parcel: {
        ...buildingApplication?.parcel,
        geometry:
          (buildingApplication?.parcel?.geometry as GeoJSONType) || undefined,
      } as ParcelSchema,
      access: buildingApplication?.access || {
        existingPath: false,
        fence: false,
        openAccessForNeighbors: false,
        pedestrian: false,
        structures: false,
        vehicular: false,
      },
    },
  });
  const query = useQuery({
    queryKey: ["applicants"],
    queryFn: getAllApplicants,
  });
  const { status, data: applicants } = query;
  const { mutate, isPending } = useUpsertPpaForm1BuildingApplicationMutation();
  function handleFormSubmit(input: ParentApplicationSchema) {
    mutate(input, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="top"
        className="w-full overflow-y-auto scroll-smooth h-dvh"
      >
        <SheetHeader className="w-full bg-card max-w-7xl mx-auto z-50 sticky top-0">
          <SheetTitle>
            {buildingApplication ? "Update" : "Create a new"} PPA1 Form:{" "}
            <span className="text-destructive underline font-semibold">
              Building Application
            </span>
          </SheetTitle>
          <SheetDescription>
            Application for Development Permission (THE PHYSICAL PLANNING ACT,
            2010)
          </SheetDescription>
        </SheetHeader>
        <div className="max-w-7xl space-y-6 mx-auto w-full  ">
          {status === "error" ? (
            <ErrorContainer
              errorMessage="Error occurred while fetching applicants"
              query={query}
            />
          ) : status === "pending" ? (
            <EmptyContainer
              title="Fetching applicants"
              description="Please wait as we fetch the applicants"
              icon={LoaderIcon}
              required
            />
          ) : !applicants.length ? (
            <EmptyContainer
              title="No applicants in Database"
              description="There are no applicants in the system yet. Start by adding an applicant to proceed"
            >
              <ButtonAddEditApplicant variant={"secondary"}>
                Create Applicant
              </ButtonAddEditApplicant>
            </EmptyContainer>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                {/* <pre>{JSON.stringify(form.watch(), null, 2)}</pre> */}
                {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <ApplicationSection
                      form={form}
                      isNewApplication={!buildingApplication}
                    />
                    <ApplicantSection form={form} applicants={applicants} />
                  </div>

                  <AddressSection form={form} />
                  <LandUseSection form={form} />
                  <UtilitySection form={form} />
                  {!buildingApplication && (
                    <Item variant={"muted"} className="col-span-2">
                      <ItemContent>
                        <Label>
                          <Checkbox checked disabled />
                          <ItemTitle>
                            By submitting, applicant shall be subjected to a
                            charge of <strong>UGX 59,000</strong>
                          </ItemTitle>
                        </Label>
                      </ItemContent>
                    </Item>
                  )}
                </div>
                <FormFooter className="my-6">
                  <LoadingButton type="submit" loading={isPending} size={"lg"}>
                    {buildingApplication
                      ? "Update PPA 1 Form "
                      : "Create the form"}
                  </LoadingButton>
                </FormFooter>
              </form>
            </Form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
