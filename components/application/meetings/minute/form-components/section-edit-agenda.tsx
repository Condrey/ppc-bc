"use client";

import TipTapEditorWithHeader from "@/components/tip-tap-editor/tip-tap-editor-with-header";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/utils";
import { AgendaSchema, MinuteSchema } from "@/lib/validation";
import { useMemo } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<MinuteSchema>;
  index: number;
  agenda: AgendaSchema;
}
export default function SectionEditAgenda({ form, index, agenda }: Props) {
  const { update } = useFieldArray({
    control: form.control,
    name: "agendas",
  });

  const form2 = useForm<AgendaSchema>({
    values: {
      ...agenda,
    },
  });

  function onSubmit(data: AgendaSchema) {
    update(index, { ...data, number: index + 1 });
  }

  const debouncedSubmit = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useDebounce(() => {
        form2.handleSubmit(onSubmit)();
      }, 1000),
    [form2],
  );
  return (
    <Form {...form2}>
      <div className="space-y-6">
        {/* <pre>{JSON.stringify(form2.watch(), null, 2)}</pre> */}
        <div className="grid sm:grid-cols-5 gap-4">
          <FormField
            control={form2.control}
            name={"number"}
            disabled
            render={({ field }) => (
              <FormItem className="sm:col-span-1">
                <FormLabel>Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form2.control}
            name={"title"}
            render={({ field }) => (
              <FormItem className="sm:col-span-4">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debouncedSubmit();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form2.control}
            name={"discussion"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Action by</FormLabel>
                <FormControl>
                  <TipTapEditorWithHeader
                    includeHeader={false}
                    {...field}
                    value={field.value!}
                    onChange={(e) => {
                      field.onChange(e);
                      debouncedSubmit();
                    }}
                    placeholder="...write the discussion about this agenda."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form2.control}
            name={"wayForward"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resolutions</FormLabel>
                <FormControl>
                  <TipTapEditorWithHeader
                    includeHeader={false}
                    {...field}
                    value={field.value!}
                    onChange={(e) => {
                      field.onChange(e);
                      debouncedSubmit();
                    }}
                    placeholder="...optionally tell us about the way forward/ resolution"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          {form2.formState.isSubmitting && "...is updating"}
        </DialogFooter>
      </div>
    </Form>
  );
}
