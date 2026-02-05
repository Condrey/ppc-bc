import FieldAbutsRoadJunction from "@/components/application/land-application/ppaForm/form-components/field-abuts-road-junction";
import FieldLandUseType from "@/components/application/land-application/ppaForm/form-components/field-land-use-type";
import FieldNatureOfInterest from "@/components/application/land-application/ppaForm/form-components/field-nature-of-interest-of-land";
import FieldNoBuildingOperations from "@/components/application/land-application/ppaForm/form-components/field-no-building-operations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LandApplicationSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";
import FieldCarriedOnDate from "./field-carried-on-date";

interface Props {
  form: UseFormReturn<LandApplicationSchema>;
}
export default function LandUseSection({ form }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Land use and site description</CardTitle>
        <CardDescription>
          Details concerning the site and land use
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FieldCarriedOnDate form={form} />
        <FieldNatureOfInterest form={form} />
        <FormField
          control={form.control}
          name="site.currentUseAndSurrounding"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current purpose (use) of Land</FormLabel>
              <FormControl>
                <Textarea
                  cols={3}
                  placeholder="what is the land or building now being used for?"
                  {...field}
                  value={field.value!}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                If not used, state the purpose for which and the date on which
                they were last used
              </FormDescription>
            </FormItem>
          )}
        />
        <FieldLandUseType form={form} />

        <FormField
          control={form.control}
          name="address.size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Land size</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g 15m x 30m x 15m x 30m"
                  {...field}
                  value={field.value!}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FieldAbutsRoadJunction form={form} />
        <FieldNoBuildingOperations form={form} />
      </CardContent>
    </Card>
  );
}
