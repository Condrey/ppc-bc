import { NumberInput } from "@/components/number-input/number-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ParentApplicationSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";
import FieldNatureOfInterest from "./field-nature-of-interest-of-land";
import ResubmissionSection from "./resubmission-section";

interface Props {
  form: UseFormReturn<ParentApplicationSchema>;
  isNewApplication: boolean;
}
export default function ApplicationSection({ form, isNewApplication }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Section</CardTitle>
        <CardDescription>
          Please enter information belonging to the Application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="ppaForm1.applicationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground" required>
                  Application Number
                </FormLabel>
                <FormControl>
                  {isNewApplication ? (
                    <Input
                      value={"auto-generated value"}
                      className="italic"
                      disabled
                    />
                  ) : (
                    <Input
                      placeholder="enter application no."
                      {...field}
                      disabled
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="application.year"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel required>Year of Applying</FormLabel>
                <FormControl>
                  <NumberInput
                    placeholder="enter the application year"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* <FieldApplicationStatus form={form} />
        <FieldApplicationType form={form} /> */}
        <FieldNatureOfInterest form={form} />
        {isNewApplication && <ResubmissionSection form={form} />}
      </CardContent>
    </Card>
  );
}
