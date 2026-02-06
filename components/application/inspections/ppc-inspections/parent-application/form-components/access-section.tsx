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
import { cn } from "@/lib/utils";
import { ParentApplicationSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<ParentApplicationSchema>;
  shouldWrap?: boolean;
}
export default function AccessSection({ form, shouldWrap = false }: Props) {
  const wrapClassName = cn(
    shouldWrap ? "flex flex-wrap *:flex-1 gap-3" : "space-y-6",
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access and Utility Section</CardTitle>
        <CardDescription>
          Let us know about the access and utility in this site. Check all boxes
          that apply.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="site.prevailingWinds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prevailing winds</FormLabel>
              <FormControl>
                <Input {...field} value={field.value!} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="site.sunDirection"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sun direction</FormLabel>
              <FormControl>
                <Input {...field} value={field.value!} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Item variant={"default"}>
          <ItemContent className="space-y-3">
            <div className={wrapClassName}>
              <FormField
                control={form.control}
                name="access.vehicular"
                render={({ field }) => (
                  <FormItem>
                    <Label
                      htmlFor="vehicular-checkbox"
                      className="cursor-pointer"
                    >
                      <FormControl>
                        <Checkbox
                          id="vehicular-checkbox"
                          className="float-start mr-0.5"
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>

                      <ItemTitle>Vehicular access. </ItemTitle>
                    </Label>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="access.pedestrian"
                render={({ field }) => (
                  <FormItem>
                    <Label
                      htmlFor="pedestrian-checkbox"
                      className="cursor-pointer"
                    >
                      <FormControl>
                        <Checkbox
                          id="pedestrian-checkbox"
                          className="float-start mr-0.5"
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>

                      <ItemTitle>Pedestrian access. </ItemTitle>
                    </Label>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={wrapClassName}>
              <FormField
                control={form.control}
                name="access.openAccessForNeighbors"
                render={({ field }) => (
                  <FormItem>
                    <Label
                      htmlFor="openAccessForNeighbors-checkbox"
                      className="cursor-pointer"
                    >
                      <FormControl>
                        <Checkbox
                          id="openAccessForNeighbors-checkbox"
                          className="float-start mr-0.5"
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>

                      <ItemTitle>Open Access Fo rNeighbors. </ItemTitle>
                    </Label>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="access.existingPath"
                render={({ field }) => (
                  <FormItem>
                    <Label
                      htmlFor="existingPath-checkbox"
                      className="cursor-pointer"
                    >
                      <FormControl>
                        <Checkbox
                          id="existingPath-checkbox"
                          className="float-start mr-0.5"
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>

                      <ItemTitle>Existing Path. </ItemTitle>
                    </Label>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={wrapClassName}>
              <FormField
                control={form.control}
                name="access.fence"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="fence-checkbox" className="cursor-pointer">
                      <FormControl>
                        <Checkbox
                          id="fence-checkbox"
                          className="float-start mr-0.5"
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>

                      <ItemTitle>Fence. </ItemTitle>
                    </Label>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="access.structures"
                render={({ field }) => (
                  <FormItem>
                    <Label
                      htmlFor="structures-checkbox"
                      className="cursor-pointer"
                    >
                      <FormControl>
                        <Checkbox
                          id="structures-checkbox"
                          className="float-start mr-0.5"
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>

                      <ItemTitle>Other structures. </ItemTitle>
                    </Label>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </ItemContent>
        </Item>
      </CardContent>
    </Card>
  );
}
