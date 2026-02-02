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
import FieldAbutsRoadJunction from "./field-abuts-road-junction";
import FieldLandUseType from "./field-land-use-type";
import FieldNoBuildingOperations from "./field-no-building-operations";

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
        <FieldLandUseType form={form} />
        <FormField
          control={form.control}
          name="landUse.acreage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acreage(Land size in acres)</FormLabel>
              <FormControl>
                <Input
                  placeholder="what is the land area size in acres?"
                  {...field}
                  value={field.value!}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="landUse.proposedDevelopment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proposed development</FormLabel>
              <FormControl>
                <Textarea
                  cols={5}
                  placeholder="describe briefly the proposed development including the purpose for which land or buildings are to be used"
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
