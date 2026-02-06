import TipTapEditorWithHeader from "@/components/tip-tap-editor/tip-tap-editor-with-header";
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
import { ApplicantData } from "@/lib/types";
import { ApplicantSchema, applicantSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useUpsertApplicantMutation } from "./mutations";

interface Props {
  applicant?: ApplicantData;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}
export default function FormAddEditApplicant({
  applicant,
  open,
  onOpenChange,
}: Props) {
  const form = useForm<ApplicantSchema>({
    resolver: zodResolver(applicantSchema),
    defaultValues: {
      id: applicant?.id || "",
      address: applicant?.address,
      contact: applicant?.contact,
      email: applicant?.email,
      name: applicant?.name,
    },
  });
  const { mutate, isPending } = useUpsertApplicantMutation();
  function submitForm(input: ApplicantSchema) {
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
              {applicant ? "Update" : "Create a new"} Applicant
            </SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <div className="space-y-6 p-3 w-fit md:w-lg lg:w-3xl">
              {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Applicant name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Okuja Jaspher" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Applicant contact</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="e.g., 0776239674"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Applicant email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g., someone@gmail.com"
                        {...field}
                        value={field.value!}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Applicant address</FormLabel>
                    <FormControl>
                      <TipTapEditorWithHeader
                        includeHeader={false}
                        placeholder="e.g., Junior quarters, Lira"
                        {...field}
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
                  {applicant ? "Update applicant" : "Create applicant"}
                </LoadingButton>
              </FormFooter>
            </div>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
