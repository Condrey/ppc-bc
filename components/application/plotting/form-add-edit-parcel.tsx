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
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { GeoJSONType, ParentApplicationData } from "@/lib/types";
import {
  ParcelSchema,
  parentApplicationSchema,
  ParentApplicationSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useUpsertParcelMutation } from "./mutations";

interface Props {
  parentApplication: ParentApplicationData;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}
export default function FormAddEditParentApplication({
  parentApplication,
  open,
  onOpenChange,
}: Props) {
  const form = useForm<ParentApplicationSchema>({
    resolver: zodResolver(parentApplicationSchema),
    values: {
      ...parentApplication,
      access: undefined,
      parcel: {
        ...parentApplication.parcel,
        geometry: parentApplication.parcel?.geometry as GeoJSONType,
      } as ParcelSchema,
    },
  });
  const { mutate, isPending } = useUpsertParcelMutation();
  function submitForm(input: ParentApplicationSchema) {
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
            <SheetTitle className="text-center">Parcel and Plotting</SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <div className="space-y-6 p-3 w-fit md:w-lg ">
              {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
              <FormField
                control={form.control}
                name="parcel.plotNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Plot Number</FormLabel>
                    <FormControl>
                      <Input placeholder="enter plot number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parcel.blockNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Block Number</FormLabel>
                    <FormControl>
                      <Input placeholder="enter block number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parcel.parcelNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcel Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter Parcel Number"
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
                name="parcel.areaSqMeters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area in square meters</FormLabel>
                    <FormControl>
                      <NumberInput
                        placeholder="enter area in square meters"
                        {...field}
                        value={field.value!}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <pre className="whitespace-pre-wrap">
                {/* {JSON.stringify(form.watch("parcel.geometry"), null, 2)} */}
              </pre>
              <FormField
                control={form.control}
                name="parcel.geometry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Geometry</FormLabel>
                    <FormControl>
                      <Textarea
                        cols={4}
                        placeholder="enter geometry"
                        {...field}
                        value={JSON.stringify(field.value, null, 2)}
                      />
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
                  update parcel
                </LoadingButton>
              </FormFooter>
            </div>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
