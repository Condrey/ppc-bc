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
import { Textarea } from "@/components/ui/textarea";
import { allLandUseTypes, landUseTypes } from "@/lib/enums";
import { LandUseType } from "@/lib/generated/prisma/enums";
import { LandApplicationSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<LandApplicationSchema>;
}
export default function FieldLandUseType({ form }: Props) {
  return (
    <>
      <FormField
        control={form.control}
        name="landUse.landUseType"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Land use type</FormLabel>
            <Select
              onValueChange={(v) => {
                field.onChange(v);
                if (v !== LandUseType.OTHERS) {
                  form.setValue("landUse.otherLandUseType", undefined);
                }
              }}
              value={field.value ?? undefined}
            >
              <SelectTrigger className="w-full">
                <FormControl>
                  <SelectValue
                    placeholder={"Please choose a land use type"}
                    className="w-full"
                  />
                </FormControl>
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectLabel>Allowed Land use types</SelectLabel>
                  {allLandUseTypes.map((landUseType) => {
                    const { formDesc: title } = landUseTypes[landUseType];
                    return (
                      <SelectItem key={landUseType} value={landUseType}>
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
      {form.watch("landUse.landUseType") === LandUseType.OTHERS && (
        <FormField
          control={form.control}
          name="landUse.otherLandUseType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`Describe the "for other use" type`}</FormLabel>
              <FormControl>
                <Textarea
                  cols={2}
                  placeholder="Explain the other land use here..."
                  {...field}
                  value={field.value!}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
