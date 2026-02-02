import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { LandApplicationSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<LandApplicationSchema>;
}
export default function FieldNoBuildingOperations({ form }: Props) {
  const doesNotInvolveBuilding = form.watch("landUse.doesNotInvolveBuilding");
  return (
    <Item variant={"muted"}>
      <ItemContent className="space-y-5">
        <FormField
          control={form.control}
          name="landUse.doesNotInvolveBuilding"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Label
                  htmlFor="building-operations-checkbox"
                  className="cursor-pointer"
                >
                  <Checkbox
                    id="building-operations-checkbox"
                    className="float-start mr-0.5"
                    checked={field.value || false}
                    onCheckedChange={(checked) => {
                      const newValue = Boolean(checked);
                      field.onChange(newValue);
                      if (newValue === false) {
                        form.setValue("landUse.changeOfUse", undefined);
                      }
                    }}
                  />
                  <ItemTitle>
                    {"This site does not involve building operations"}
                  </ItemTitle>
                </Label>
              </FormControl>
              <FormDescription />
            </FormItem>
          )}
        />
        {doesNotInvolveBuilding && (
          <FormField
            control={form.control}
            name="landUse.changeOfUse"
            render={({ field }) => (
              <FormItem
                className={cn(
                  " transition-all",
                  doesNotInvolveBuilding
                    ? "animate-collapsible-down"
                    : "animate-collapsible-up",
                )}
              >
                <FormLabel>State the nature of change</FormLabel>
                <FormControl>
                  <Textarea
                    cols={3}
                    placeholder="If the proposed development consists only of a change of use and does not involve building operations, state the exact nature of such change"
                    {...field}
                    value={field.value ?? ""}
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
