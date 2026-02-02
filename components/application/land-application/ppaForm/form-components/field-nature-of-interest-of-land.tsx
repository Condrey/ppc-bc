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
import {
  allNaturesOfInterestInLand,
  naturesOfInterestInLand,
} from "@/lib/enums";
import { LandApplicationSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<LandApplicationSchema>;
}
export default function FieldNatureOfInterest({ form }: Props) {
  return (
    <FormField
      control={form.control}
      name="natureOfInterest"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Nature of interest in land</FormLabel>
          <Select
            onValueChange={(v) => field.onChange(v)}
            value={field.value ?? undefined}
          >
            <SelectTrigger className="w-full">
              <FormControl>
                <SelectValue
                  placeholder={"Please choose a nature of interest"}
                  className="w-full"
                />
              </FormControl>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Choose from here</SelectLabel>
                {allNaturesOfInterestInLand.map((natureOfInterest) => {
                  const { formDesc: title } =
                    naturesOfInterestInLand[natureOfInterest];
                  return (
                    <SelectItem key={natureOfInterest} value={natureOfInterest}>
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
