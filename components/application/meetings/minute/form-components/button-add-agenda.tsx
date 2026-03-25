"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import { AgendaSchema, MinuteSchema } from "@/lib/validation";
import { useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";

interface Props extends ButtonProps {
  thisForm: UseFormReturn<MinuteSchema>;
}
export default function ButtonAddAgenda({ thisForm: form, ...props }: Props) {
  const { user } = useSession();
  const isAuthorized =
    user && myPrivileges[user.role].includes(Role.PHYSICAL_PLANNER);
  const [open, setOpen] = useState(false);
  const { append } = useFieldArray({
    control: form.control,
    name: "agendas",
  });
  const watchedAgendas = form.getValues("agendas");

  const form2 = useForm<AgendaSchema>({
    values: {
      number: watchedAgendas.length + 1,
      title: "",
      shouldHaveBuildingApplications: false,
      shouldHaveLandApplications: false,
      discussion: "",
      wayForward: "",
    },
  });

  function onSubmit(data: AgendaSchema) {
    append(data);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isAuthorized && (
        <DialogTrigger asChild>
          <Button
            title={"Add agenda"}
            {...props}
            onClick={() => setOpen(true)}
          />
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add agenda</DialogTitle>
        </DialogHeader>
        <Form {...form2}>
          <div className="space-y-6">
            <FormField
              control={form2.control}
              name={"title"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minute title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Item variant={"muted"} size={"sm"}>
              <ItemContent className="space-y-3">
                <div className={"space-y-4"}>
                  <FormField
                    control={form2.control}
                    name="shouldHaveBuildingApplications"
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="building-checkbox"
                          className="cursor-pointer"
                        >
                          <FormControl>
                            <Checkbox
                              id="building-checkbox"
                              className="float-start mr-0.5"
                              checked={field.value ?? false}
                              onCheckedChange={(value) => {
                                field.onChange(value);
                                if (value) {
                                  form2.setValue(
                                    "shouldHaveLandApplications",
                                    false,
                                  );
                                }
                              }}
                            />
                          </FormControl>

                          <ItemTitle>
                            Should Contain Building Applications
                          </ItemTitle>
                        </Label>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form2.control}
                    name="shouldHaveLandApplications"
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="land-checkbox"
                          className="cursor-pointer"
                        >
                          <FormControl>
                            <Checkbox
                              id="land-checkbox"
                              className="float-start mr-0.5"
                              checked={field.value ?? false}
                              onCheckedChange={(value) => {
                                field.onChange(value);
                                if (value) {
                                  form2.setValue(
                                    "shouldHaveBuildingApplications",
                                    false,
                                  );
                                }
                              }}
                            />
                          </FormControl>

                          <ItemTitle>
                            Should Contain Land Applications
                          </ItemTitle>
                        </Label>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </ItemContent>
            </Item>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => form2.handleSubmit(onSubmit)()}
              >
                Add
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
