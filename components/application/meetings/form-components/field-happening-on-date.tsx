import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CardFooter } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MeetingSchema } from "@/lib/validation";
import { formatDate } from "date-fns";
import { ChevronsUpDownIcon, Clock2Icon } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<MeetingSchema>;
}
export default function FieldHappeningOnDate({ form }: Props) {
  const [open, setOpen] = useState(false);
  const date = form.getValues("happeningOn");
  const dateValue = date ? new Date(date) : new Date();
  const defaultValue =
    dateValue.getHours() +
    ":" +
    dateValue.getMinutes() +
    ":" +
    dateValue.getSeconds();
  return (
    <FormField
      control={form.control}
      name="happeningOn"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Date of meeting</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  type="button"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between font-normal"
                >
                  {field.value
                    ? formatDate(field.value, "PPPPp")
                    : "Select date"}
                  <ChevronsUpDownIcon className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={field.value!}
                captionLayout="dropdown"
                onSelect={(date) => {
                  form.setValue("happeningOn", date!);
                  form.clearErrors("happeningOn");
                  setOpen(false);
                }}
              />
              <hr />
              <CardFooter className="pb-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="time-from">
                      Time of occurrence
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="time-from"
                        type="time"
                        step="1"
                        defaultValue={defaultValue}
                        onChange={(e) => {
                          const time = e.currentTarget.value;
                          const [hours = "0", minutes = "0", seconds = "0"] =
                            time.split(":");
                          const date = field.value
                            ? new Date(field.value)
                            : new Date();
                          date.setHours(
                            Number(hours),
                            Number(minutes),
                            Number(seconds),
                          );
                          form.setValue("happeningOn", date);
                          form.clearErrors("happeningOn");
                        }}
                        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                      <InputGroupAddon>
                        <Clock2Icon className="text-muted-foreground" />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                </FieldGroup>
              </CardFooter>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
