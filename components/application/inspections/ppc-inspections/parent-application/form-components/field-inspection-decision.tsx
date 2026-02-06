import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allApplicationDecisions, applicationDecisions } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { ParentApplicationSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<ParentApplicationSchema>;
}
export default function FieldInspectionDecision({ form }: Props) {
  return (
    <FormField
      control={form.control}
      name="inspection.decision"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Inspection decision</FormLabel>
          <Select
            defaultValue={field.value}
            onValueChange={(v) => field.onChange(v)}
          >
            <SelectTrigger className="w-full">
              <FormControl>
                <SelectValue
                  placeholder={"Please choose a decision "}
                  className="w-full"
                />
              </FormControl>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Allowed decisions</SelectLabel>
                {allApplicationDecisions.map((decision) => {
                  const {
                    icon: Icon,
                    className,
                    formTitle,
                  } = applicationDecisions[decision];
                  return (
                    <SelectItem key={decision} value={decision}>
                      <Icon
                        className={cn("inline [&_svg]:size-4", className)}
                      />{" "}
                      {formTitle}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
