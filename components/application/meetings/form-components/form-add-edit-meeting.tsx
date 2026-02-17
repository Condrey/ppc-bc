import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormFooter,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Committee } from "@/lib/generated/prisma/enums";
import { MeetingData } from "@/lib/types";
import { MeetingSchema, meetingSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useUpsertMeetingMutation } from "../mutations";
import FieldHappeningOnDate from "./field-happening-on-date";
import FieldMeetingCommittee from "./field-meeting-committee";
import FieldSendInvitations from "./field-send-invitations";

interface Props {
  meeting?: MeetingData;
  committee: Committee;

  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}
export default function FormAddEditMeeting({
  meeting,
  committee,
  open,
  onOpenChange,
}: Props) {
  const form = useForm<MeetingSchema>({
    resolver: zodResolver(meetingSchema),
    values: {
      id: meeting?.id || "",
      committee: meeting?.committee || committee || Committee.PPC,
      title: meeting?.title || "",
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      happeningOn: meeting?.happeningOn!,
      venue: meeting?.venue || "",
      sendInvitations: meeting?.sendInvitations || true,
      message: meeting?.message || "",

      postponedOn: meeting?.postponedOn,
    },
  });
  const { mutate, isPending } = useUpsertMeetingMutation();
  function submitForm(input: MeetingSchema) {
    mutate(input, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-fit overflow-y-auto scroll-smooth h-dvh"
      >
        <div className="max-w-7xl space-y-6 mx-auto w-full  ">
          <SheetHeader className="w-full">
            <SheetTitle>
              {meeting ? "Update" : "Create a new"} Meeting
            </SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <div className="space-y-6 p-3 w-fit md:w-lg lg:w-3xl">
              {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
              <div className="grid md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel required>Meeting title</FormLabel>
                      <FormControl>
                        <Input placeholder="enter meeting title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FieldMeetingCommittee form={form} />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel required>Meeting venue</FormLabel>
                      <FormControl>
                        <Input placeholder="enter meeting venue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FieldHappeningOnDate form={form} />
              </div>
              <FieldSendInvitations form={form} />

              <FormFooter className="mt-6">
                <Button
                  onClick={() => form.reset()}
                  type="button"
                  size={"lg"}
                  variant={"outline"}
                >
                  Reset Form
                </Button>
                <LoadingButton
                  type="button"
                  loading={isPending}
                  size={"lg"}
                  onClick={() => form.handleSubmit(submitForm)()}
                >
                  {meeting ? "Update meeting" : "Create meeting"}
                </LoadingButton>
              </FormFooter>
            </div>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
