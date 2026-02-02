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
import { allApplicationTypes, applicationTypes } from "@/lib/enums";
import { LandApplicationSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<LandApplicationSchema>;
}
export default function FieldApplicationType({ form }: Props) {
  return (
    <FormField
      control={form.control}
      name="application.type"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Application type</FormLabel>
          <Select
            onValueChange={(v) => field.onChange(v)}
            value={field.value ?? undefined}
          >
            <SelectTrigger className="w-full">
              <FormControl>
                <SelectValue
                  placeholder={"Please choose an application type"}
                  className="w-full"
                />
              </FormControl>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Allowed Application Types</SelectLabel>
                {allApplicationTypes.map((applicationType) => {
                  const { title } = applicationTypes[applicationType];
                  return (
                    <SelectItem key={applicationType} value={applicationType}>
                      {title}
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
