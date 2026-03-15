import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormFooter } from "@/components/ui/form";
import LoadingButton from "@/components/ui/loading-button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { committees, meetingStatuses } from "@/lib/enums";
import { Meeting } from "@/lib/generated/prisma/client";
import { MinuteData } from "@/lib/types";
import { AgendaSchema, MinuteSchema, minuteSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate } from "date-fns";
import { AlertTriangleIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useAddEditMinuteMutation } from "../mutations";
import SectionAbsenteeism from "./section-absenteeism";
import SectionAgendas from "./section-agendas";
import SectionAttendees from "./section-attendees";
import SectionSignatories from "./section-signatories";

interface Props {
  meeting: Meeting;
  minute?: MinuteData;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}
export default function FormAddEditMinute({
  meeting,
  minute,
  open,
  onOpenChange,
}: Props) {
  const form = useForm<MinuteSchema>({
    resolver: zodResolver(minuteSchema),
    values: {
      id: minute?.id || "",
      secretaryId: minute?.secretaryId || "",
      chairId: minute?.chairId || "",
      meetingId: minute?.meetingId || meeting.id || "",
      absentMembersWithApology: minute?.absentMembersWithApology || [],
      agendas: (minute?.agendas || []) as AgendaSchema[],
      presentMembers: minute?.presentMembers || [],
    },
  });
  const {
    committee: _committee,
    postponedOn,
    status,
    happeningOn,
    venue: venueOfTheMeeting,
    title: titleOfTheMeeting,
  } = meeting;
  const { title: committee } = committees[_committee];
  const dateOfOccurrence = postponedOn
    ? formatDate(postponedOn, "PPP")
    : formatDate(happeningOn, "PPP");
  const timeOfOccurrence = postponedOn
    ? formatDate(postponedOn, "p")
    : formatDate(happeningOn, "p");
  const { title: statusOfTheMeeting } = meetingStatuses[status];
  const errors = Object.values(form.formState.errors);
  const { mutate, isPending } = useAddEditMinuteMutation();
  function submitForm(input: MinuteSchema) {
    mutate(input, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" className=" overflow-y-auto scroll-smooth h-dvh">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitForm)} className="space-y-6">
            <div className="max-w-7xl space-y-6 mx-auto w-full  ">
              <SheetHeader className="w-full flex flex-col md:flex-row gap-3 justify-between   ">
                <div>
                  <SheetTitle className="line-clamp-1">
                    {minute ? "Update this minute" : "Start minuting"}
                  </SheetTitle>
                  <SheetDescription className="text-justify md:text-start hyphens-auto">
                    <strong>{statusOfTheMeeting}</strong> {titleOfTheMeeting},
                    venue: {venueOfTheMeeting}, date: {dateOfOccurrence}, time:{" "}
                    {timeOfOccurrence} organized by the {committee}
                  </SheetDescription>
                </div>
                <FormFooter>
                  <LoadingButton loading={isPending}>
                    {minute ? "Update Minute" : "Add Minute"}
                  </LoadingButton>
                </FormFooter>
              </SheetHeader>
              {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
              {!!errors.length && (
                <Alert variant={"destructive"}>
                  <AlertTriangleIcon />
                  <AlertTitle className="font-bold">
                    Validation error
                  </AlertTitle>
                  <AlertDescription>
                    {errors.map((e) => e.message).join(", ")}
                  </AlertDescription>
                </Alert>
              )}
              {/* <pre>{JSON.stringify(form.watch(), null, 2)}</pre> */}
              <Tabs defaultValue="attendance">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="attendance">1. Attendance</TabsTrigger>
                  <TabsTrigger value="agendas">2. Agendas</TabsTrigger>
                  <TabsTrigger value="signatories">3. Signatories</TabsTrigger>
                </TabsList>
                <TabsContent value="attendance">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <SectionAttendees form={form} />
                    <SectionAbsenteeism form={form} />
                  </div>
                </TabsContent>
                <TabsContent value="agendas">
                  <SectionAgendas
                    form={form}
                    meetingDate={postponedOn ? postponedOn : happeningOn}
                  />
                </TabsContent>
                <TabsContent value="signatories">
                  <SectionSignatories form={form} />
                </TabsContent>
              </Tabs>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
