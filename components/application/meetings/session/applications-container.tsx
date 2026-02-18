import { TypographyH3, TypographyH4 } from "@/components/headings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { applicationStatuses, naturesOfInterestInLand } from "@/lib/enums";
import {
  ApplicationStatus,
  ApplicationType,
} from "@/lib/generated/prisma/enums";
import { ApplicationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import SectionHeader from "../../inspections/ppc-inspections/section-header";
import SectionInspectionBody from "../../inspections/ppc-inspections/section-inpection-body";
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
      <pre>{JSON.stringify(application, null, 2)}</pre>
      <div className="flex items-center justify-between">
        <TypographyH4
          text={`[Committee ${decisionMade}]`}
          className={cn(
            "font-black capitalize animate-pulse",
            decision === ApplicationStatus.DEFERRED ||
              decision === ApplicationStatus.REJECTED
              ? "text-destructive"
              : decision === ApplicationStatus.UNDER_REVIEW
                ? "text-warning"
                : decision === ApplicationStatus.APPROVED
                  ? "text-success"
                  : "text-muted-foreground animate-none",
          )}
        />
        <ButtonGroup className="flex ms-auto items-center gap-0.5">
          <ButtonDecideApplication
            application={application}
            decision="REJECTED"
            variant="destructive"
          >
            Reject
          </ButtonDecideApplication>
          <ButtonDecideApplication
            application={application}
            decision="DEFERRED"
            className="bg-warning"
          >
            Defer
          </ButtonDecideApplication>
          <ButtonDecideApplication
            application={application}
            decision="APPROVED"
            className="bg-success"
          >
            Approve
          </ButtonDecideApplication>
        </ButtonGroup>
      </div>
      <TypographyH3
        text={owners}
        className='before:content-["Owner(s):_"] before:text-muted-foreground'
      />
      <SectionHeader application={application} />
      <TypographyH4
        text={
          isLandApplication
            ? `Applying for ${title} land application`
            : `Building on a ${title} land`
        }
        className="capitalize"
      />
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
              {parcel && (
                <div className="flex gap-2 justify-between  items-center">
                  {parcel.parcelNumber ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={"link"}
                          className="font-sans slashed-zero"
                          onClick={() => {
                            navigator.clipboard
                              .writeText(parcel.parcelNumber!)
                              .then(() => {
                                toast.info(
                                  `Parcel number ${parcel.parcelNumber} copied to clipboard`,
                                );
                              })
                              .catch((err) => {
                                console.error("Failed to copy:", err);
                                toast.error(
                                  `Could not copy parcel number ${parcel.parcelNumber}`,
                                );
                              });
                          }}
                        >
                          Parcel number: {parcel.parcelNumber}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Click to copy parcel number
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Badge variant={"destructive"}>
                      Parcel number: Not plotted
                    </Badge>
                  )}

                  {parcel.geometry ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={"link"}
                          onClick={() => {
                            navigator.clipboard
                              .writeText(
                                JSON.stringify(parcel.geometry, null, 2),
                              )
                              .then(() => {
                                toast.info(`Geometry copied to clipboard`);
                              })
                              .catch((err) => {
                                console.error("Failed to copy:", err);
                                toast.error(`Could not copy geometry`);
                              });
                          }}
                        >
                          Copy Geometry
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Click to copy Geometry</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Badge variant={"destructive"}>
                      No Geometry was addded
                    </Badge>
                  )}
                </div>
              )}
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
