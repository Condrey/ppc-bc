import { getMeetingById } from "@/components/application/meetings/action";
import { committees, meetingStatuses } from "@/lib/enums";
import { Committee } from "@/lib/generated/prisma/enums";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PageClient from "./pageClient";

interface Props {
  params: Promise<{ meetingId: string; committeeType: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { meetingId: encodedMeetingId } = await params;
  const meetingId = decodeURIComponent(encodedMeetingId);
  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    return {
      title: "404 - Meeting not found",
      description:
        "This resource has been removed or changed to another location.",
    };
  }
  const {
    committee: _committee,
    postponedOn,
    status,
    happeningOn,
    venue: venueOfTheMeeting,
    title: titleOfTheMeeting,
    title,
  } = meeting;
  const { title: committee } = committees[_committee];
  const dateOfOccurrence = postponedOn
    ? formatDate(postponedOn, "PPP")
    : formatDate(happeningOn, "PPP");
  const timeOfOccurrence = postponedOn
    ? formatDate(postponedOn, "p")
    : formatDate(happeningOn, "p");
  const { title: statusOfTheMeeting } = meetingStatuses[status];
  return {
    title,
    description: ` ${statusOfTheMeeting} ${titleOfTheMeeting}, venue: ${venueOfTheMeeting}, date: ${dateOfOccurrence}, time: ${timeOfOccurrence} organized by the ${committee}`,
  };
}

export default async function Page({ params }: Props) {
  const { meetingId: encodedMeetingId, committeeType } = await params;
  const meetingId = decodeURIComponent(encodedMeetingId);
  const committee = decodeURIComponent(committeeType) as Committee;
  const meeting = await getMeetingById(meetingId);

  if (!meeting) return notFound();

  return (
    <Suspense>
      <PageClient meeting={meeting} committee={committee} />

      {committee}
    </Suspense>
  );
}
