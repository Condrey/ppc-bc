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
import { cn } from "@/lib/utils";
import { ParentApplicationSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<ParentApplicationSchema>;
  shouldWrap?: boolean;
}
export default function DistanceSection({ form, shouldWrap = false }: Props) {
  const wrapClassName = cn(
    shouldWrap ? "flex flex-wrap *:flex-1 gap-3" : "space-y-6",
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distance and nearby features</CardTitle>
        <CardDescription>Enter distance in meters from</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={wrapClassName}>
          <FormField
            control={form.control}
            name="site.distanceFromFeatures.fromRoad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From highway/road</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter distance here"
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
            name="site.distanceFromFeatures.fromWetland"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Wetland</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter distance here"
                    {...field}
                    value={field.value!}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className={wrapClassName}>
          <FormField
            control={form.control}
            name="site.distanceFromFeatures.fromReserve"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From forest reserve</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter distance here"
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
            name="site.distanceFromFeatures.fromGreenBelt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From green belt</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter distance here"
                    {...field}
                    value={field.value!}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className={wrapClassName}>
          <FormField
            control={form.control}
            name="site.distanceFromFeatures.fromPowerLine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From high volt power line</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter distance here"
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
            name="site.distanceFromFeatures.fromLagoon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From sewerage lagoon</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter distance here"
                    {...field}
                    value={field.value!}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className={wrapClassName}>
          <FormField
            control={form.control}
            name="site.distanceFromFeatures.fromHills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Rocks/hills</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter distance here"
                    {...field}
                    value={field.value!}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="site.distanceFromFeatures.fromOthers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From others</FormLabel>
              <FormControl>
                <Input
                  placeholder="enter distance here"
                  {...field}
                  value={field.value!}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>If true, Specify the feature</FormDescription>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
