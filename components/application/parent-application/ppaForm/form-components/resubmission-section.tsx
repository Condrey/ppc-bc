import { NumberInput } from "@/components/number-input/number-input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ParentApplicationSchema } from "@/lib/validation";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<ParentApplicationSchema>;
}
export default function ResubmissionSection({ form }: Props) {
  const wasResubmitted = !!form.getValues("ppaForm1.previousApplicationNo");
  const [check, setCheck] = useState<boolean>(wasResubmitted);
  return (
    <Item variant={"muted"}>
      <ItemContent className="space-y-5">
        <Label htmlFor="resubmission-checkbox" className="cursor-pointer">
          <Checkbox
            id="resubmission-checkbox"
            className="float-start mr-0.5"
            checked={check}
            onCheckedChange={() => {
              const newValue = !check;
              if (newValue === false) {
                form.setValue("ppaForm1.previousApplicationNo", undefined);
                form.clearErrors("ppaForm1.previousApplicationNo");
              } else {
                form.setError("ppaForm1.previousApplicationNo", {
                  message: "Please indicate the previous application number",
                  type: "required",
                });
              }
              setCheck(newValue);
            }}
          />
          <ItemTitle>{"This application was previously registered."}</ItemTitle>
        </Label>
        {check && (
          <FormField
            control={form.control}
            name="ppaForm1.previousApplicationNo"
            render={({ field }) => (
              <FormItem
                className={cn(
                  " transition-all",
                  check ? "animate-collapsible-down" : "animate-collapsible-up",
                )}
              >
                <FormLabel>Previous application number</FormLabel>
                <FormControl>
                  <NumberInput
                    placeholder="enter previous application number"
                    {...field}
                    value={field.value!}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </ItemContent>
    </Item>
  );
}
