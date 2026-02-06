import { NumberInput } from "@/components/number-input/number-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormFooter,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PaymentData } from "@/lib/types";
import { PaymentSchema, paymentSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import FieldPaymentMethod from "./field-payment-method";
import { useUpsertPaymentMutation } from "./mutations";

interface Props {
  payment?: PaymentData;
  feeAssessmentId: string;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}
export default function FormAddEditPayment({
  payment,
  feeAssessmentId,
  open,
  onOpenChange,
}: Props) {
  const form = useForm<PaymentSchema>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      id: payment?.id || "",
      amountPaid: payment?.amountPaid,
      feeAssessmentId: payment?.feeAssessmentId || feeAssessmentId,
      paymentMethod: payment?.paymentMethod,
      receivedById: payment?.receivedById,
      referenceNumber: payment?.referenceNumber,
    },
  });
  const { mutate, isPending } = useUpsertPaymentMutation();
  function submitForm(input: PaymentSchema) {
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
              {payment ? "Update" : "Create a new"} Payment
            </SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <div className="space-y-6 p-3 w-fit md:w-lg lg:w-3xl">
              <FormField
                control={form.control}
                name="amountPaid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Amount paid</FormLabel>
                    <FormControl>
                      <NumberInput placeholder="enter amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FieldPaymentMethod form={form} />
              <FormField
                control={form.control}
                name="referenceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>PRN</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter PRN here"
                        {...field}
                        value={field.value!}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  {payment ? "Update payment" : "Create payment"}
                </LoadingButton>
              </FormFooter>
            </div>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
