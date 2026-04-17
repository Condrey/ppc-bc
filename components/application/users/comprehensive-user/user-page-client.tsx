"use client";

import { useSession } from "@/app/(auth)/session-provider";
import { getUserById } from "@/components/application/users/action";
import { TypographyH2, TypographyH3 } from "@/components/headings";
import ErrorContainer from "@/components/query-container/error-container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { myPrivileges } from "@/lib/enums";
import { ComprehensiveUserData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import SectionApplications from "./applications/section-applications";
import SectionInspectionsCarriedOut from "./inspection/section-inspections-carriedout";
import SectionMeetingMinutes from "./meeting-minutes/section-meeting-minutes";
import SectionPayments from "./section-payments";
import { SectionUserDetails } from "./section-user-details";

export default function UserPageClient({
  initialData,
}: {
  initialData: ComprehensiveUserData;
}) {
  const id = initialData.id;
  const { user: sessionUser } = useSession();
  const query = useQuery({
    queryKey: ["user", id],
    queryFn: async () => getUserById(id),
    initialData,
  });
  const { data: user, status } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage="An error occurred while fetching user"
        query={query}
      />
    );
  }
  if (!user) return notFound();
  const {
    applicants,
    documents,
    inspections,
    minutesAbsentWithApology,
    minutesPresent,
    writtenMinutes,
    chairedMinutes,
    payments,
    feeAssessments,
    name,
  } = user;
  const appeals = applicants.flatMap((a) => a.appeals);
  const resubmissions = applicants.flatMap((a) => a.resubmissions);
  const applications = applicants.flatMap((a) => a.applications);

  const items: {
    id: string;
    visible: boolean;
    title: string;
    content: React.ReactNode;
  }[] = [
    {
      id: "applications",
      visible: !!user,
      title: `${sessionUser?.id === user.id ? "My" : `${user.name}'s`}  Applications`,
      content: (
        <SectionApplications
          appeals={appeals}
          resubmissions={resubmissions}
          applications={applications}
        />
      ),
    },
    {
      id: "inspections",
      title: "Inspections Carried out",
      visible: !!user && myPrivileges[user.role].includes("APPLICANT"),
      content: <SectionInspectionsCarriedOut inspections={inspections} />,
    },
    {
      id: "meetings",
      title: "Meetings attended, Missed, Chaired, ...",
      visible: !!user && myPrivileges[user.role].includes("APPLICANT"),

      content: (
        <SectionMeetingMinutes
          chairedMinutes={chairedMinutes}
          minutesAbsentWithApology={minutesAbsentWithApology}
          minutesPresent={minutesPresent}
          writtenMinutes={writtenMinutes}
        />
      ),
    },

    {
      id: "fees-and-payments",
      visible: !!user,
      title: "Fees and payments",
      content: (
        <SectionPayments feeAssessments={feeAssessments} payments={payments} />
      ),
    },
    {
      id: "documents",
      visible: !!user,
      title: `${sessionUser?.id === user.id ? "My" : `${user.name}'s`} shared documents`,
      content: <br />,
    },
  ];
  return (
    <div className="flex gap-4 flex-col md:flex-row-reverse">
      {/* user details  */}
      <SectionUserDetails user={user} />
      {/* other info  */}
      <div className="flex-1 space-y-4">
        <TypographyH2 text={name} className="line-clamp-2 hidden md:block" />
        <TypographyH3
          text={"Other information"}
          className="line-clamp-2 md:hidden "
        />

        <Accordion
          collapsible
          type="single"
          defaultValue={items[1].id}
          className="max-w-5xl border"
        >
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="px-3 bg-muted uppercase">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="px-3 bg-muted/20">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
