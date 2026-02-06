import { NumberInput } from "@/components/number-input/number-input";
import {
  Form,
  FormControl,
  FormField,
  FormFooter,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/ui/loading-button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Application } from "@/lib/generated/prisma/client";
import { FeeAssessmentType } from "@/lib/generated/prisma/enums";
import { FeeAssessmentData } from "@/lib/types";
import { getApplicationNumber } from "@/lib/utils";
import { FeeAssessmentSchema, feeAssessmentSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import FieldAssessmentType from "./field-assessment-type";
import { useUpsertFeeAssessmentMutation } from "./mutations";

interface Props {
  feeAssessment?: FeeAssessmentData;
  assessmentType: FeeAssessmentType;
  application: Application;

  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}
export default function FormAddEditFeeAssessment({
  feeAssessment,
  assessmentType,
  application,
  open,
  onOpenChange,
}: Props) {
  const { type, year, applicationNo, id: applicationId } = application;
  const applicationNumber = getApplicationNumber(applicationNo, year, type);
  const form = useForm<FeeAssessmentSchema>({
    resolver: zodResolver(feeAssessmentSchema),
    values: {
      id: feeAssessment?.id || "",
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      amountAssessed: feeAssessment?.amountAssessed!,
      applicationId: feeAssessment?.applicationId || applicationId,
      assessmentType: feeAssessment?.assessmentType || assessmentType,
    },
  });
  const { mutate, isPending } = useUpsertFeeAssessmentMutation();
  function submitForm(input: FeeAssessmentSchema) {
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
        side="right"
        className="sm:max-w-fit overflow-y-auto scroll-smooth h-dvh"
      >
        <div className="max-w-7xl space-y-6 mx-auto w-full  ">
          <SheetHeader className="w-full">
            <SheetTitle>
              {feeAssessment ? "Update" : "Create a new"} Fee Assessment
            </SheetTitle>
            <SheetDescription>For {applicationNumber}</SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <div className="space-y-6 p-3 w-fit md:w-lg ">
              <FieldAssessmentType
                form={form}
                assessmentType={assessmentType}
              />
              <FormField
                control={form.control}
                name="amountAssessed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Amount assessed</FormLabel>
                    <FormControl>
                      <NumberInput placeholder="enter fee" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormFooter className="mt-6">
                <LoadingButton
                  type="button"
                  loading={isPending}
                  size={"lg"}
                  onClick={() => form.handleSubmit(submitForm)()}
                >
                  {feeAssessment
                    ? "Update fee Assessment"
                    : "Create fee Assessment"}
                </LoadingButton>
              </FormFooter>
            </div>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
