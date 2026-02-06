import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { ParentApplicationSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<ParentApplicationSchema>;
}
export default function UtilitySection({ form }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Utility Section</CardTitle>
        <CardDescription>
          Let us know about the utility in this site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="ppaForm1.utility.waterSupplyMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Water supply Method</FormLabel>
              <FormControl>
                <Input placeholder="How is water supplied?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ppaForm1.utility.sewageDisposalMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Sewage disposal Method</FormLabel>
              <FormControl>
                <Input placeholder="How is sewage disposed?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ppaForm1.utility.surfaceWaterDisposalMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Surface water disposal Method</FormLabel>
              <FormControl>
                <Input
                  placeholder="How is surface water disposed?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ppaForm1.utility.refuseDisposalMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Refuse disposal Method</FormLabel>
              <FormControl>
                <Input placeholder="How is refused disposed?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Item variant={"muted"}>
          <ItemContent>
            <FormField
              control={form.control}
              name="ppaForm1.shouldHaveNewRoadAccess"
              render={({ field }) => (
                <FormItem>
                  <Label
                    htmlFor="road-access-checkbox"
                    className="cursor-pointer"
                  >
                    <FormControl>
                      <Checkbox
                        id="road-access-checkbox"
                        className="float-start mr-0.5"
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <ItemTitle>
                      Development requires new/ alternative road access.{" "}
                    </ItemTitle>
                  </Label>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="site.hasElectricity"
              render={({ field }) => (
                <FormItem>
                  <Label
                    htmlFor="electricity-checkbox"
                    className="cursor-pointer"
                  >
                    <FormControl>
                      <Checkbox
                        id="electricity-checkbox"
                        className="float-start mr-0.5"
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <ItemTitle>The site has electricity.</ItemTitle>
                  </Label>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="site.hasNationalWater"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="water-checkbox" className="cursor-pointer">
                    <FormControl>
                      <Checkbox
                        id="water-checkbox"
                        className="float-start mr-0.5"
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <ItemTitle>The site has National water.</ItemTitle>
                  </Label>
                  <FormMessage />
                </FormItem>
              )}
            />
          </ItemContent>
        </Item>
      </CardContent>
    </Card>
  );
}
