import ButtonAddEditUser from "@/components/application/users/button-add-edit-user";
import { useCommitteeMemberQuery } from "@/components/application/users/query";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { roles } from "@/lib/enums";
import { MinuteSchema } from "@/lib/validation";
import { DotIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import ButtonAddAbsentee from "./button-add-absentee";

interface Props {
  form: UseFormReturn<MinuteSchema>;
}
export default function SectionAbsenteeism({ form }: Props) {
  const { remove } = useFieldArray({
    control: form.control,
    name: "absentMembersWithApology",
  });
  const query = useCommitteeMemberQuery();
  const { data: committeeMembers, status } = query;
  return (
    <Card>
      <CardHeader>
        <div className="w-full flex flex-col md:flex-row gap-3 justify-between  ">
          <div className="space-y-2">
            <CardTitle>Absenteeism</CardTitle>
            <CardDescription>
              List of members who were absent with apology.
            </CardDescription>
          </div>
          <ButtonAddAbsentee
            thisForm={form}
            committeeMembers={committeeMembers || []}
            size={"sm"}
            type="button"
            className="ms-auto"
          >
            <PlusIcon /> absentee
          </ButtonAddAbsentee>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="absentMembersWithApology"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Absent with Apology</FormLabel>
              {status === "error" ? (
                <ErrorContainer
                  errorMessage="Failed to fetch committee members"
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
                    <ButtonAddAbsentee
                      committeeMembers={committeeMembers}
                      thisForm={form}
                    >
                      Create member
                    </ButtonAddAbsentee>
                  ) : !field.value.length ? (
                    <EmptyContainer
                      title="No members added"
                      description="Absent members with apology will appear here. Please, make sure to add all the members who were absent with apology to this list. This is important for the record and for future reference."
                      className="[&_svg]:hidden"
                    >
                      <ButtonAddAbsentee
                        thisForm={form}
                        committeeMembers={committeeMembers}
                        variant={"secondary"}
                        type="button"
                        size={"sm"}
                      >
                        Add absentee
                      </ButtonAddAbsentee>
                    </EmptyContainer>
                  ) : (
                    <div className="space-y-0.5">
                      {field.value.map((f, index) => {
                        const member = committeeMembers.find(
                          (c) => c.id === f.id,
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

              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
