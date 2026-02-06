import ButtonAddEditUser from "@/components/application/users/button-add-edit-user";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { Button } from "@/components/ui/button";
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
import { roles } from "@/lib/enums";
import { ParentApplicationSchema } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { DotIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { getCommitteeMembers } from "../../actions";
import ButtonAddInspector from "./button-add-inspector";

interface Props {
  form: UseFormReturn<ParentApplicationSchema>;
}
export default function InspectorsSection({ form }: Props) {
  const { remove, fields } = useFieldArray({
    control: form.control,
    name: "inspection.inspectorsIds",
  });
  const query = useQuery({
    queryKey: ["committee-members"],
    queryFn: getCommitteeMembers,
  });
  const { data: committeeMembers, status } = query;
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row w-full items-start justify-between">
          <div>
            <CardTitle>Inspectors</CardTitle>
            <CardDescription>
              List of all the inspectors who were on site
            </CardDescription>
          </div>
          <ButtonAddInspector
            thisForm={form}
            committeeMembers={committeeMembers || []}
            size={"sm"}
            type="button"
          >
            <PlusIcon /> inspector
          </ButtonAddInspector>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="inspection.inspectorsIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Inspectors</FormLabel>
              {status === "error" ? (
                <ErrorContainer
                  errorMessage="Failed to fetch committee member"
                  query={query}
                />
              ) : status === "pending" ? (
                <EmptyContainer
                  title="Loading..."
                  description="Fetching committee members from the database."
                  className="[&_svg]:animate-spin"
                  icon={Loader2Icon}
                />
              ) : !committeeMembers.length ? (
                <EmptyContainer
                  title="No committee member in database"
                  description="Seems like you do not have any committee member in the database. Contact the chairperson to add member."
                >
                  <ButtonAddEditUser variant={"secondary"}>
                    Create member
                  </ButtonAddEditUser>
                </EmptyContainer>
              ) : (
                <div>
                  <FormControl></FormControl>
                  {!field.value ? (
                    <ButtonAddInspector
                      committeeMembers={committeeMembers}
                      thisForm={form}
                    >
                      Create member
                    </ButtonAddInspector>
                  ) : !field.value.length ? (
                    <EmptyContainer
                      title="No members added"
                      description="Please add the inspectors that went to the site"
                      className="[&_svg]:hidden"
                      required
                    >
                      <ButtonAddInspector
                        thisForm={form}
                        committeeMembers={committeeMembers}
                        variant={"secondary"}
                        type="button"
                        size={"sm"}
                      >
                        Add inspector
                      </ButtonAddInspector>
                    </EmptyContainer>
                  ) : (
                    <div className="space-y-0.5">
                      {field.value.map((f, index) => {
                        const member = committeeMembers.find(
                          (c) => c.id === f.userId,
                        );
                        if (!member) return null;
                        const { title } = roles[member.role];
                        return (
                          <li
                            key={member.id}
                            className="bg-muted p-2 flex items-center justify-between rounded-md"
                          >
                            <p className="*:inline">
                              {index + 1} <DotIcon />
                              {member.name} -{" "}
                              <strong className="">{title}</strong>
                            </p>
                            <Button
                              size={"icon-sm"}
                              variant={"ghost"}
                              className=""
                              type="button"
                              onClick={() => remove(index)}
                            >
                              <XIcon />
                            </Button>
                          </li>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <FormDescription>
                Please, make sure all the inspectors who went on site appears
                here.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
