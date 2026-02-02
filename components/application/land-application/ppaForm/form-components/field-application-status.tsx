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
import { allApplicationStatuses, applicationStatuses } from "@/lib/enums";
import { LandApplicationSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<LandApplicationSchema>;
}
export default function FieldApplicationStatus({ form }: Props) {
  return (
    <FormField
      control={form.control}
      name="application.status"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Application status</FormLabel>
          <Select onValueChange={(v) => field.onChange(v)}>
            <SelectTrigger className="w-full">
              <FormControl>
                <SelectValue
                  placeholder={"Please choose an application status"}
                  className="w-full"
                />
              </FormControl>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Allowed Application Statuses</SelectLabel>
                {allApplicationStatuses.map((applicationStatus) => {
                  const { title } = applicationStatuses[applicationStatus];
                  return (
                    <SelectItem
                      key={applicationStatus}
                      value={applicationStatus}
                    >
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
