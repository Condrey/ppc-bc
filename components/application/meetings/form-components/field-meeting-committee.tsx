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
import { allCommittees, committees } from "@/lib/enums";
import { MeetingSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<MeetingSchema>;
}
export default function FieldMeetingCommittee({ form }: Props) {
  return (
    <FormField
      control={form.control}
      name="committee"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Committee</FormLabel>
          <Select
            defaultValue={field.value}
            onValueChange={(v) => field.onChange(v)}
          >
            <SelectTrigger className="w-full">
              <FormControl>
                <SelectValue
                  placeholder={"Please choose an meeting committee"}
                  className="w-full"
                />
              </FormControl>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Allowed committees</SelectLabel>
                {allCommittees.map((committee) => {
                  const { title } = committees[committee];
                  return (
                    <SelectItem key={committee} value={committee}>
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
