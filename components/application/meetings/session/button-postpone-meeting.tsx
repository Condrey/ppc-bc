"use client";

import { Badge } from "@/components/ui/badge";
import { ButtonProps } from "@/components/ui/button";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import LoadingButton from "@/components/ui/loading-button";
import { MeetingData } from "@/lib/types";
import { getMeetingNumber } from "@/lib/utils";
import {
  singleContentDateSchema,
  SingleContentDateSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {} from "@radix-ui/react-dialog";
import { formatDate } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { usePostponeMeetingMutation } from "../mutations";

interface Props extends ButtonProps {
  meeting: MeetingData;
}
const getTimeInput = (dateValue: Date) =>
  dateValue.getHours() +
  ":" +
  dateValue.getMinutes() +
  ":" +
  dateValue.getSeconds();

const getDateTimeOutput = (time: string, date: Date | null | undefined) => {
  const [hours = "0", minutes = "0", seconds = "0"] = time.split(":");
  const newDate = date ? new Date(date) : new Date();
  newDate.setHours(Number(hours), Number(minutes), Number(seconds));
  newDate.setDate(Number(date?.getDate()));
  newDate.setMonth(Number(date?.getMonth()));
  newDate.setFullYear(Number(date?.getFullYear()));
  return newDate;
};

export default function ButtonPostponeMeeting({ meeting, ...props }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = usePostponeMeetingMutation();
  const { meetingNo, postponedOn, happeningOn, title } = meeting;
  const date = postponedOn ? postponedOn : happeningOn;
  const meetingNumber = getMeetingNumber(meetingNo, date);
  const form = useForm<SingleContentDateSchema>({
    resolver: zodResolver(singleContentDateSchema),
  });
  function handleSubmit(input: SingleContentDateSchema) {
    mutate(
      { meetingId: meeting.id, postponedOn: input.singleContentDate },
      {
        onSuccess: () => setOpen(true),
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
        <DialogHeader className="items-start border-b">
          <DialogTitle>Postpone {meetingNumber}</DialogTitle>
          <DialogDescription>Title: {title}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="space-y-0.5 mb-6">
            <Badge>
              <strong>Current:</strong> {formatDate(date, "PPPp")}
            </Badge>
            <Badge variant={"outline"}>
              {/* <strong>Postponed:</strong> {formatDate(dateValue, "PPPp")} */}
            </Badge>
          </div>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <pre>{JSON.stringify(watchedDate, null, 2)}</pre>

            <FormField
              control={form.control}
              name="singleContentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter postponed time and date</FormLabel>
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
                      <Field className="max-w-fit mx-auto">
                        <FieldLabel>Date of occurrence</FieldLabel>
                        <FieldContent>
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
                          />
                        </FieldContent>
                      </Field>
                    </FieldGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
