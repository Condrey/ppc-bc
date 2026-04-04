import { TypographyH3, TypographyH4 } from "@/components/headings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { applicationStatuses, naturesOfInterestInLand } from "@/lib/enums";
import {
  ApplicationStatus,
  ApplicationType,
} from "@/lib/generated/prisma/enums";
import { ApplicationData } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { InspectionPageClient } from "../../inspections/ppc-inspections/inspection-page-client";
import SectionHeader from "../../inspections/ppc-inspections/section-header";
import { ListOfApplicationFeesAssessments } from "../../parent-application/fees-assessment/list-of-application-fees-assessments";
import SectionAppeals from "../../parent-application/section-appeals";
import SectionDocuments from "../../parent-application/section-documents";
import SectionPlottingAndParcels from "../../parent-application/section-plotting-and-parcels";
import SectionResubmissions from "../../parent-application/section-resubmissions";
import SectionWorkflowStages from "../../parent-application/section-workflow-stages";
import ButtonDecideApplication from "./button-decide-application";

interface Props {
  applications: ApplicationData[];
}

export default function ApplicationsContainer({ applications }: Props) {
  return (
    <Carousel>
      <CarouselContent>
        {applications.map((app) => (
          <CarouselItem key={app.id}>
            <ApplicationContainer application={app} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

interface ApplicationContainerProps {
  application: ApplicationData;
}
function ApplicationContainer({ application }: ApplicationContainerProps) {
  const isMobile = useIsMobile();
  const {
    owners,
    type,
    landApplication,
    buildingApplication,
    status: decision,
    workflowStages,
    appeals,
    resubmissions,
    documents,
  } = application;
  const isLandApplication = type === ApplicationType.LAND;
  const parentApplication = isLandApplication
    ? landApplication
    : buildingApplication;
  const { natureOfInterest } = parentApplication!;
  const { title: decisionMade } = applicationStatuses[decision];
  const { title } = naturesOfInterestInLand[natureOfInterest];

  const items: {
    id: string;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
  }[] = [
    {
      id: "plottingAndParcels",
      title: "Parcel and plotting",
      children: <SectionPlottingAndParcels application={application} />,
    },
    {
      id: "inspections",
      title: "Inspection report",
      children: (
        <InspectionPageClient
          application={application}
          applicationId={application.id}
          showHeader={false}
        />
      ),
    },
    {
      id: "feesAssessment",
      title: "Fees Assessment",
      children: <ListOfApplicationFeesAssessments application={application} />,
    },
    {
      id: "workFlowStages",
      title: "Workflow Stages",
      children: <SectionWorkflowStages workflowStages={workflowStages} />,
    },
    {
      id: "appeals",
      title: `Appeals (${formatNumber(appeals.length)})`,
      children: <SectionAppeals appeals={appeals} />,
    },
    {
      id: "resubmissions",
      title: `Resubmissions (${formatNumber(resubmissions.length)})`,
      children: <SectionResubmissions resubmissions={resubmissions} />,
    },
    {
      id: "documents",
      title: `Documents (${formatNumber(documents.length)})`,
      children: <SectionDocuments documents={documents} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* <pre>{JSON.stringify(application, null, 2)}</pre> */}
      <TypographyH4
        text={
          isLandApplication
            ? `Application for ${title} certificate`
            : `Building permission on a ${title} land`
        }
        className="capitalize px-3  md:text-center *:inline"
      >
        <span className='before:content-["Owned_by_"] md:hidden inline before:text-muted-foreground px-3'>
          {owners}
        </span>
      </TypographyH4>

      <TypographyH4
        text={isMobile ? "" : `[Application ${decisionMade}]`}
        className={cn(
          "font-black capitalize  flex-col md:flex-row px-3 flex md:items-center justify-between flex-wrap",
          decision === ApplicationStatus.DEFERRED ||
            decision === ApplicationStatus.REJECTED
            ? "text-destructive"
            : decision === ApplicationStatus.UNDER_REVIEW
              ? "text-warning"
              : decision === ApplicationStatus.APPROVED
                ? "text-success"
                : "text-muted-foreground animate-none",
        )}
      >
        <ButtonGroup className="flex ms-auto items-center gap-0.5  ">
          <ButtonDecideApplication
            application={application}
            decision="REJECTED"
            variant="destructive"
            disabled={decision === ApplicationStatus.REJECTED}
          >
            Reject
          </ButtonDecideApplication>
          <ButtonDecideApplication
            application={application}
            decision="DEFERRED"
            className="bg-warning"
            disabled={decision === ApplicationStatus.DEFERRED}
          >
            Defer
          </ButtonDecideApplication>
          <ButtonDecideApplication
            application={application}
            decision="APPROVED"
            className="bg-success"
            disabled={decision === ApplicationStatus.APPROVED}
          >
            Approve
          </ButtonDecideApplication>
        </ButtonGroup>
      </TypographyH4>
      <TypographyH3
        text={owners}
        className='before:content-["Owned_by_"] hidden md:block before:text-muted-foreground px-3'
      />
      <SectionHeader application={application} />

      <div>
        <Accordion type="single" collapsible className="border rounded-md">
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
    </div>
  );
}
