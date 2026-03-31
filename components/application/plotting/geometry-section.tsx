import { TypographyH4 } from "@/components/headings";
import { NumberInput } from "@/components/number-input/number-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { latLngSchema, ParentApplicationSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretDownIcon, CaretUpIcon } from "@radix-ui/react-icons";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import z from "zod";

interface Props {
  form: UseFormReturn<ParentApplicationSchema>;
}
export default function GeometrySection({ form }: Props) {
  const defaultOpen = !form.getValues("id");
  const [addMore, setAddMore] = useState(defaultOpen);
  type Type = z.infer<typeof latLngSchema>;
  const watchedParentGeometry = form.watch("parcel.geometry");
  const { append: addCoordinate, remove: deleteCoordinate } = useFieldArray({
    control: form.control,
    name: "parcel.geometry",
  });
  const form2 = useForm<Type>({
    resolver: zodResolver(latLngSchema),
    defaultValues: {
      lat: undefined,
      lng: undefined,
    },
  });

  function handleAddButtonClick(input: Type) {
    addCoordinate(input);
    form2.reset();
  }
  function handleADeleteButtonClick(index: number) {
    deleteCoordinate(index);
  }
  return (
    <div className="space-y-2">
      <TypographyH4
        text="Geometry"
        className="flex justify-between items-center gap-2"
      >
        <Button
          type="button"
          variant={"ghost"}
          onClick={() => setAddMore((value) => !value)}
        >
          {addMore ? (
            <>
              All done <CaretUpIcon />
            </>
          ) : (
            <>
              Add more <CaretDownIcon />
            </>
          )}
        </Button>
      </TypographyH4>
      <div className="space-y-4 ">
        {watchedParentGeometry?.map((geometry, number) => (
          <div
            key={number}
            className="flex flex-col md:flex-row items-end gap-3 bg-muted p-3 "
          >
            <FormField
              control={form.control}
              name={`parcel.geometry.${number}.lat`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <NumberInput
                      placeholder={`...coordinate ${number + 1}'s latitude`}
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
              name={`parcel.geometry.${number}.lng`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <NumberInput
                      placeholder={`...coordinate ${number + 1}'s longitude`}
                      {...field}
                      value={field.value!}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              title="Remove this coordinate"
              variant={"destructive"}
              size={"icon-lg"}
              onClick={() => handleADeleteButtonClick(number)}
              className=""
            >
              <XIcon />
              <span className="sr-only">Remove this coordinate</span>
            </Button>
          </div>
        ))}
      </div>
      {/* <pre>{JSON.stringify(form2.formState.errors, null, 2)}</pre> */}
      {addMore && (
        <Form {...form2}>
          <div className="flex gap-2 outline p-3 bg-warning items-end">
            <FormField
              control={form2.control}
              name={`lat`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <NumberInput
                      placeholder={`...new latitude coordinate`}
                      {...field}
                      defaultValue={field.value!}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form2.control}
              name={`lng`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <NumberInput
                      placeholder={`...new longitude coordinate`}
                      {...field}
                      value={field.value!}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant={"default"}
              size={"icon-lg"}
              title="Add this coordinate"
              onClick={() => form2.handleSubmit(handleAddButtonClick)()}
            >
              <PlusIcon />
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
