import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ParentApplicationSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<ParentApplicationSchema>;
  shouldWrap?: boolean;
}
export default function AddressSection({ form, shouldWrap = false }: Props) {
  const wrapClassName = cn(
    shouldWrap ? "flex flex-wrap *:flex-1 gap-3" : "space-y-6",
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Address and location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="address.district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>District</FormLabel>
              <FormControl>
                <Input
                  placeholder="which district?"
                  {...field}
                  value={field.value!}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={wrapClassName}>
          <FormField
            control={form.control}
            name="address.subCounty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub county</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter the sub county"
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
            name="address.parish"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parish</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter the parish"
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
            name="address.town"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Town</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter the town"
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
            name="address.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter the street"
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
            name="parcel.blockNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Block</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter the block you reside in"
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
            name="parcel.plotNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Plot number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter plot number"
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
          name="address.location"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Describe Location</FormLabel>
              <FormControl>
                <Textarea
                  cols={2}
                  placeholder="enter location description"
                  {...field}
                  value={field.value!}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
