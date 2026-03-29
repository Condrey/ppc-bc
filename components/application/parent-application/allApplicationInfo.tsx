"use client";
import { TypographyH2, TypographyH3 } from "@/components/headings";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { applicationTypes } from "@/lib/enums";
import { ParentApplicationData } from "@/lib/types";
import { InspectionPageClient } from "../inspections/ppc-inspections/inspection-page-client";
import SectionHeader from "../inspections/ppc-inspections/section-header";
import { ListOfApplicationFeesAssessments } from "./fees-assessment/list-of-application-fees-assessments";
import { useParentApplicationQuery } from "./query";
import SectionAppeals from "./section-appeals";
import SectionDocuments from "./section-documents";
import SectionMeetingAndMinutes from "./section-meeting-and-minutes";
import SectionResubmissions from "./section-resubmissions";
import SectionWorkflowStages from "./section-workflow-stages";

interface Props {
  parentApplication: ParentApplicationData;
}
export default function AllApplicationInfo({
  parentApplication: _parentApplication,
}: Props) {
  const query = useParentApplicationQuery(
    _parentApplication,
    _parentApplication.application.type,
  );
  const { data: parentApplication, status } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage="Failed to get application. Please try again later"
        query={query}
      />
    );
  }
  if (!parentApplication) {
    return (
      <EmptyContainer
        title="There is no such application"
        description="It seems that this application does not exist or has been deleted."
      />
    );
  }
  const { application } = parentApplication;
  const {
    minuteNumber,
    status: applicationStatus,
    type,
    meeting,
    owners,
    workflowStages,
    appeals,
    documents,
    resubmissions,
  } = application;
  const { title: applicationType } = applicationTypes[type];
  const items: {
    id: string;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
  }[] = [
    {
      id: "workFlowStages",
      title: "Workflow Stages",
      children: <SectionWorkflowStages workflowStages={workflowStages} />,
    },
    {
      id: "feesAssessment",
      title: "Fees Assessment",
      children: (
        <ListOfApplicationFeesAssessments
          parentApplication={parentApplication}
        />
      ),
    },
    {
      id: "inspections",
      title: "Inspections",
      children: (
        <InspectionPageClient
          application={application}
          applicationId={application.id}
          showHeader={false}
        />
      ),
    },
    {
      id: "Meeting and Minutes",
      title: "Meeting and Minutes",
      children: (
        <SectionMeetingAndMinutes
          meeting={meeting}
          minuteNumber={minuteNumber}
          status={applicationStatus}
        />
      ),
    },
    {
      id: "appeals",
      title: "Appeals",
      children: <SectionAppeals appeals={appeals} />,
    },
    {
      id: "resubmissions",
      title: "Resubmissions",
      children: <SectionResubmissions resubmissions={resubmissions} />,
    },
    {
      id: "documents",
      title: "Documents",
      children: <SectionDocuments documents={documents} />,
    },
  ];
  return (
    <div className="space-y-6">
      <TypographyH2 text={` ${applicationType} owned by ${owners}`} />
      <SectionHeader application={application} />
      <TypographyH3 text="Other information" />
      <Accordion type="single" collapsible className="border">
        {items.map(({ id, title, children }) => (
          <AccordionItem key={id} value={id}>
            <AccordionTrigger className="px-3 bg-muted">
              {title}
            </AccordionTrigger>
            <AccordionContent className="px-3 ">{children}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
