import {
  getMeetingById,
} from "@/components/application/meetings/action";
import { Committee } from "@/lib/generated/prisma/enums";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageClient from "./page-client";

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
  const { minute, title } = meeting;
  return {
    title,
    description: `Meeting under minute number ${minute?.minuteNumber ?? "(Not minuted)"} with the title ${title}`,
  };
}
export default async function Page({ params }: Props) {
  const { meetingId: encodedMeetingId, committeeType } = await params;
  const meetingId = decodeURIComponent(encodedMeetingId);
  const committee = decodeURIComponent(committeeType) as Committee;
  const meeting = await getMeetingById(meetingId);

  if (!meeting) return notFound();

  return <PageClient meeting={meeting} committee={committee} />;
}
