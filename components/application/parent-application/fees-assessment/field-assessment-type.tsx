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
import { allFeesAssessmentTypes, feesAssessmentTypes } from "@/lib/enums";
import { FeeAssessmentType } from "@/lib/generated/prisma/enums";
import { FeeAssessmentSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<FeeAssessmentSchema>;
  assessmentType: FeeAssessmentType;
}
export default function FieldAssessmentType({ form, assessmentType }: Props) {
  const assessmentTypes = allFeesAssessmentTypes.filter((a) => {
    if (
      assessmentType === FeeAssessmentType.BUILDING_APPLICATION &&
      a === FeeAssessmentType.LAND_APPLICATION
    ) {
      return null;
    }
    if (
      assessmentType === FeeAssessmentType.LAND_APPLICATION &&
      a === FeeAssessmentType.BUILDING_APPLICATION
    ) {
      return null;
    }
    return a;
  });
  return (
    <FormField
      control={form.control}
      name="assessmentType"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Assessment type</FormLabel>
          <Select
            defaultValue={field.value}
            onValueChange={(v) => field.onChange(v)}
          >
            <SelectTrigger className="w-full">
              <FormControl>
                <SelectValue
                  placeholder={"Please choose an assessment type"}
                  className="w-full"
                />
              </FormControl>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Allowed assessment types</SelectLabel>
                {assessmentTypes.map((assessmentType) => {
                  const { title, icon: Icon } =
                    feesAssessmentTypes[assessmentType];
                  return (
                    <SelectItem key={assessmentType} value={assessmentType}>
                      <Icon className="inline" /> {title}
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
