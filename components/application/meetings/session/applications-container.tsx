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
import { applicationStatuses, naturesOfInterestInLand } from "@/lib/enums";
import {
  ApplicationStatus,
  ApplicationType,
} from "@/lib/generated/prisma/enums";
import { ApplicationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import SectionHeader from "../../inspections/ppc-inspections/section-header";
import SectionInspectionBody from "../../inspections/ppc-inspections/section-inspection-body";
import PlottingContainer from "../../plotting/plotting-container";
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
  const {
    owners,
    type,
    landApplication,
    buildingApplication,
    inspections,
    status: decision,
  } = application;
  const isLandApplication = type === ApplicationType.LAND;
  const parentApplication = isLandApplication
    ? landApplication
    : buildingApplication;
  const { natureOfInterest, parcel } = parentApplication!;
  const { title: decisionMade } = applicationStatuses[decision];
  const { title } = naturesOfInterestInLand[natureOfInterest];
  const inspection = inspections[inspections.length - 1];
  return (
    <div className="space-y-6">
      {/* <pre>{JSON.stringify(application, null, 2)}</pre> */}
      <TypographyH4
        text={
          isLandApplication
            ? `Application for ${title} certificate`
            : `Building permission on a ${title} land`
        }
        className="capitalize px-3 text-center"
      />
      <TypographyH4
        text={`[Committee ${decisionMade}]`}
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
        className='before:content-["Owned_by_"] before:text-muted-foreground px-3'
      />
      <SectionHeader application={application} />

      <div>
        <Accordion type="multiple" className="border rounded-md">
          <AccordionItem value="inspections">
            <AccordionTrigger className="bg-muted  p-3">
              Inspection report
            </AccordionTrigger>
            <AccordionContent className="px-3">
              <SectionInspectionBody
                application={application}
                inspection={inspection}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="plotting">
            <AccordionTrigger className="bg-muted  p-3">
              Parcel and plotting
            </AccordionTrigger>
            <AccordionContent className="px-3">
              <PlottingContainer application={application} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="documents">
            <AccordionTrigger className="bg-muted  p-3">
              Guiding documents
            </AccordionTrigger>
            <AccordionContent className="px-3">
              TODO: display documents
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
