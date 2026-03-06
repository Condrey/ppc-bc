import { EmptyContainer } from "@/components/query-container/empty-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MinuteSchema } from "@/lib/validation";
import { SignatureIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import FieldChairPerson from "./field-chairperson";
import FieldSecretary from "./field-secretary";

export default function SectionSignatories({
  form,
}: {
  form: UseFormReturn<MinuteSchema>;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <EmptyContainer
        title="Signatories"
        description="Please select the chairperson and secretary for this meeting minute"
        className="hidden md:flex bg-muted/30"
        icon={SignatureIcon}
      ></EmptyContainer>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Meeting Signatories</CardTitle>
          <CardDescription>
            Choose the chairperson and Secretary from the list of committee
            members
          </CardDescription>
        </CardHeader>
        <CardContent className=" space-y-6">
          <FieldChairPerson form={form} />
          <FieldSecretary form={form} />
        </CardContent>
      </Card>
    </div>
  );
}
