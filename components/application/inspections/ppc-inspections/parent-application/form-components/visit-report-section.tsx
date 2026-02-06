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
import { Textarea } from "@/components/ui/textarea";
import { ParentApplicationSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";
import FieldInspectionDecision from "./field-inspection-decision";

interface Props {
  form: UseFormReturn<ParentApplicationSchema>;
}
export default function VisitReportSection({ form }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row w-full items-start justify-between">
          <div>
            <CardTitle>Visit report and Final decision</CardTitle>
            <CardDescription>
              Let the Surveyor in votes of the inspectors write a brief report
              for the visit.{" "}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="inspection.visitReport"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Visit Report</FormLabel>
              <FormControl>
                <Textarea
                  cols={5}
                  placeholder="describe it here..."
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FieldInspectionDecision form={form} />
      </CardContent>
    </Card>
  );
}
