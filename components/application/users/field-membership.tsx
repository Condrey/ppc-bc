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
import { allMemberships, memberships } from "@/lib/enums";
import { SignUpSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<SignUpSchema>;
}
export default function FieldMembership({ form }: Props) {
  return (
    <FormField
      control={form.control}
      name="ppcMembership"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Membership</FormLabel>
          <Select onValueChange={field.onChange} value={field.value!}>
            <SelectTrigger className="w-full">
              <FormControl>
                <SelectValue
                  placeholder={"Please choose a membership"}
                  className="w-full"
                />
              </FormControl>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Allowed Memberships</SelectLabel>
                {allMemberships.map((membership) => {
                  const { title } = memberships[membership];
                  return (
                    <SelectItem key={membership} value={membership}>
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
