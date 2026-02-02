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
export default function FieldAbutsRoadJunction({ form }: Props) {
  const isChecked = form.watch("landUse.doesItAbutRoadJunction");
  return (
    <Item variant={"muted"}>
      <ItemContent className="space-y-5">
        <FormField
          control={form.control}
          name="landUse.doesItAbutRoadJunction"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Label htmlFor="abut-checkbox" className="cursor-pointer">
                  <Checkbox
                    id="abut-checkbox"
                    className="float-start mr-0.5"
                    checked={field.value ?? false}
                    onCheckedChange={(checked) => {
                      const newValue = Boolean(checked);
                      field.onChange(newValue);
                      if (newValue === false) {
                        form.setValue(
                          "landUse.roadJunctionDescription",
                          undefined,
                        );
                      }
                    }}
                  />
                  <ItemTitle>This site abuts a road junction.</ItemTitle>
                </Label>
              </FormControl>
              <FormDescription />
            </FormItem>
          )}
        />
        {isChecked && (
          <FormField
            control={form.control}
            name="landUse.roadJunctionDescription"
            render={({ field }) => (
              <FormItem
                className={cn(
                  " transition-all",
                  isChecked
                    ? "animate-collapsible-down"
                    : "animate-collapsible-up",
                )}
              >
                <FormLabel>Describe road junction</FormLabel>
                <FormControl>
                  <Textarea
                    cols={3}
                    placeholder="If the site abuts a road junction, give details and height of any proposed walls, fence, etc., fronting thereon"
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
