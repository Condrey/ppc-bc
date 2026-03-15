"use client";

import { ButtonProps } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import LoadingButton from "@/components/ui/loading-button";
import { MeetingData } from "@/lib/types";
import { getDateTimeOutput, getMeetingNumber, getTimeInput } from "@/lib/utils";
import {
  singleContentDateSchema,
  SingleContentDateSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {} from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEndMeetingMutation } from "../mutations";

interface Props extends ButtonProps {
  meeting: MeetingData;
}

export default function ButtonEndMeeting({ meeting, ...props }: Props) {
  const [open, setOpen] = useState(false);
  const [withCustomDate, setWithCustomDate] = useState(false);
  const { mutate, isPending } = useEndMeetingMutation();
  const { meetingNo, postponedOn, happeningOn, title } = meeting;
  const date = postponedOn ? postponedOn : happeningOn;
  const meetingNumber = getMeetingNumber(meetingNo, date);
  const form = useForm<SingleContentDateSchema>({
    resolver: zodResolver(singleContentDateSchema),
    defaultValues: {
      singleContentDate: meeting.endedAt || new Date(),
    },
  });
  function handleSubmit(
    input: SingleContentDateSchema,
    event?: React.BaseSyntheticEvent,
  ) {
    const submitter = (event?.nativeEvent as SubmitEvent)
      ?.submitter as HTMLButtonElement;
    const action = submitter?.value;
    mutate(
      {
        meetingId: meeting.id,
        endedAt: action === "now" ? new Date() : input.singleContentDate,
      },
      {
        onSuccess: () => setOpen(false),
      },
    );
  }
  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedDate = form.watch("singleContentDate");
  const dateValue = watchedDate ? new Date(watchedDate) : date;
  const defaultValue = getTimeInput(dateValue);

  const [time, setTime] = useState(defaultValue);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <LoadingButton
          loading={isPending}
          title={"Postpone meeting"}
          {...props}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="items-start ">
          <DialogTitle>End {meetingNumber}</DialogTitle>
          <DialogDescription>Title: {title}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="w-full max-w-fit mx-auto">
              <LoadingButton
                size={"lg"}
                variant={"destructive"}
                loading={isPending}
                value={"draft"}
              >
                End meeting now
              </LoadingButton>
            </div>

            <div className="flex w-full text-muted-foreground gap-2 items-center">
              <hr className="flex-1" />
              Or
              <hr className="flex-1" />
            </div>
            <h2 className="text-center">Use a custom time and date</h2>
            <FormField
              control={form.control}
              name="singleContentDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="time">
                          Time of occurrence
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id="time"
                            type="time"
                            step={"1"}
                            value={time}
                            onChange={(e) => {
                              const time = e.currentTarget.value;
                              const dateTimeOutput = getDateTimeOutput(
                                time,
                                field.value,
                              );
                              setTime(time);
                              form.setValue(
                                "singleContentDate",
                                dateTimeOutput,
                              );
                              form.clearErrors("singleContentDate");
                            }}
                          />
                        </InputGroup>
                      </Field>
                      <Field>
                        <FieldLabel>Date of occurrence</FieldLabel>
                        <FieldContent className="max-w-fit mx-auto">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              const newDate = getDateTimeOutput(time, date);

                              form.setValue("singleContentDate", newDate!);
                              form.clearErrors("singleContentDate");
                              toast("Results", {
                                description: (
                                  <pre>
                                    {JSON.stringify({ newDate, date }, null, 2)}
                                  </pre>
                                ),
                              });
                            }}
                            className="border"
                          />
                        </FieldContent>
                      </Field>
                    </FieldGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ButtonGroup className="justify-center w-full gap-1">
              <LoadingButton
                size={"lg"}
                variant={"destructive"}
                loading={isPending}
                value={"custom"}
              >
                End using above date
              </LoadingButton>
            </ButtonGroup>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
