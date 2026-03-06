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
import ButtonAddAttendee from "./button-add-attendee";

interface Props {
  form: UseFormReturn<MinuteSchema>;
}
export default function SectionAttendees({ form }: Props) {
  const { remove } = useFieldArray({
    control: form.control,
    name: "presentMembers",
  });
  const query = useCommitteeMemberQuery();
  const { data: committeeMembers, status } = query;
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row w-full items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Attendance</CardTitle>
            <CardDescription>
              List of members who were present in attendance.
            </CardDescription>
          </div>
          <ButtonAddAttendee
            thisForm={form}
            committeeMembers={committeeMembers || []}
            size={"sm"}
            type="button"
          >
            <PlusIcon /> attendee
          </ButtonAddAttendee>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="presentMembers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Present Members</FormLabel>
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
                    <ButtonAddAttendee
                      committeeMembers={committeeMembers}
                      thisForm={form}
                    >
                      Create member
                    </ButtonAddAttendee>
                  ) : !field.value.length ? (
                    <EmptyContainer
                      title="No members added"
                      description="Present members shall appear here once you add them. Please, make sure to add all the attendees who were present in the meeting."
                      className="[&_svg]:hidden"
                    >
                      <ButtonAddAttendee
                        thisForm={form}
                        committeeMembers={committeeMembers}
                        variant={"secondary"}
                        type="button"
                        size={"sm"}
                      >
                        Add attendee
                      </ButtonAddAttendee>
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
