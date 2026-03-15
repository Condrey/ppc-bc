import { TypographyMuted } from "@/components/headings";
import { EmptyContainer } from "@/components/query-container/empty-container";
import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MeetingData } from "@/lib/types";
import { getMinuteNumber } from "@/lib/utils";
import SectionBuildingApplications from "./section-building-applications";
import SectionLandApplications from "./section-land-applications";

export default function ListOfMeetingMinutes({
  meeting,
}: {
  meeting: MeetingData;
}) {
  const { minute, happeningOn, postponedOn } = meeting;
  if (!minute) {
    return (
      <EmptyContainer
        title="No agendas"
        description="There are no agenda created in the minutes"
      ></EmptyContainer>
    );
  }
  return (
    <Accordion type="multiple">
      {minute.agendas.map((a) => {
        const {
          discussion,
          id,
          number,
          shouldHaveBuildingApplications,
          shouldHaveLandApplications,
          title,
          wayForward,
        } = a;
        return (
          <AccordionItem value={id} key={id}>
            <AccordionTrigger className="bg-accent px-3">
              <div>
                <strong>
                  {number} ⋅ {title}
                </strong>
                <TypographyMuted
                  text={getMinuteNumber({
                    date: postponedOn ? postponedOn : happeningOn,
                    number,
                  })}
                  className=""
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3">
              {shouldHaveBuildingApplications ? (
                <SectionBuildingApplications meeting={meeting} />
              ) : shouldHaveLandApplications ? (
                <SectionLandApplications meeting={meeting} />
              ) : (
                <div className="flex gap-3 flex-col md:flex-row *:flex-1 divide-y md:divide-y-0 md:divide-x ">
                  <div className="pb-3 md:pb-0 md:pe-3">
                    <h3 className="font-bold tracking-tight text-warning uppercase ">
                      Action by
                    </h3>
                    <TipTapViewer content={discussion} />
                  </div>
                  <div>
                    <h3 className="font-bold text-success tracking-tight uppercase ">
                      Resolution
                    </h3>
                    <TipTapViewer content={wayForward} />
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
