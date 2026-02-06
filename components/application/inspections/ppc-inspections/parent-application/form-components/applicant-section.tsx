import CommandItemApplicant from "@/components/application/parent-application/application/applicant/command-item-applicant";
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
import { Textarea } from "@/components/ui/textarea";
import { ApplicantData } from "@/lib/types";
import { ParentApplicationSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<ParentApplicationSchema>;
  applicant: ApplicantData;
}
export default function ApplicantSection({ form, applicant }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row w-full items-start justify-between">
          <div>
            <CardTitle>Applicant</CardTitle>
            <CardDescription>
              Please enter information belonging to the Applicant and Owner(s)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <CommandItemApplicant
          title="Applicant"
          applicant={applicant}
          isChecked={false}
          avatarSize="45px"
        />
        <FormField
          control={form.control}
          name="application.owners"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{`Owner's name(s)`}</FormLabel>
              <FormControl>
                <Textarea
                  cols={2}
                  placeholder="enter the name of the owner(s)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                If many, enter names separated by a comma
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
