import { EmptyContainer } from "@/components/query-container/empty-container";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  applicationStatuses,
  landUseTypes,
  naturesOfInterestInLand,
} from "@/lib/enums";
import { ApplicationStatus } from "@/lib/generated/prisma/enums";
import { ApplicationData, MeetingData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export default function SectionLandApplications({
  meeting,
}: {
  meeting: MeetingData;
}) {
  const { applications } = meeting;
  const parentApplications = applications.filter((a) => a.type === "LAND");

  return (
    <>
      {!parentApplications.length ? (
        <EmptyContainer
          title="No Land Application"
          description="There are no land Applications that were reviewed in this meeting."
          className={"[&_svg]:hidden md:p-0 p-3"}
        />
      ) : (
        <div>
          <Table className="table border ">
            <TableHeader>
              <TableRow className="*:font-bold *:border">
                <TableHead>S/N</TableHead>
                <TableHead>OWNER</TableHead>
                <TableHead>TENURE</TableHead>
                <TableHead>LOCATION</TableHead>
                <TableHead>ROAD</TableHead>
                <TableHead>USER</TableHead>
                <TableHead>PPC DECISION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <DecisionSection
                decision="APPROVED"
                parentApplications={parentApplications}
              />
              <DecisionSection
                decision="DEFERRED"
                parentApplications={parentApplications}
                initialIndex={
                  parentApplications.filter((p) => p.status === "APPROVED")
                    .length
                }
              />
              <DecisionSection
                decision="REJECTED"
                parentApplications={parentApplications}
                initialIndex={
                  parentApplications.filter((p) => p.status === "APPROVED")
                    .length +
                  parentApplications.filter((p) => p.status === "DEFERRED")
                    .length
                }
              />
            </TableBody>
            <TableCaption className=" text-foreground font-bold text-xl">
              {`Summary ${getDecisionItemCount({ decision: "APPROVED", parentApplications })}, ${getDecisionItemCount({ decision: "DEFERRED", parentApplications })}, ${getDecisionItemCount({ decision: "REJECTED", parentApplications })}`}
            </TableCaption>
          </Table>
        </div>
      )}
    </>
  );
}

function DecisionSection({
  parentApplications: _parentApplications,
  decision,
  initialIndex = 0,
}: {
  parentApplications: ApplicationData[];
  decision: ApplicationStatus;
  initialIndex?: number;
}) {
  const parentApplications = _parentApplications.filter(
    (p) => p.status === decision,
  );
  const numberOfItems = parentApplications.length;
  return (
    <>
      {parentApplications.map((parentApplication, index) => {
        const { id, landApplication, owners, status, inspections } =
          parentApplication;
        const inspection = !inspections.length
          ? undefined
          : inspections[inspections.length - 1];
        if (!landApplication) return null;
        const {
          address: {
            cell,
            parish,
            subCounty,
            district,
            location,
            village,
            street,
          },
          parcel,
          natureOfInterest: _natureOfInterest,
          landUse: { landUseType: _landUseType, otherLandUseType },
        } = landApplication;
        const { title: landUseType } = landUseTypes[_landUseType];
        const { title: natureOfInterest } =
          naturesOfInterestInLand[_natureOfInterest];
        const { title: applicationStatus, variant } =
          applicationStatuses[status];
        return (
          <TableRow key={id} className="*:border">
            <TableCell>
              {String(initialIndex + index + 1).padStart(2, "0")}
            </TableCell>
            <TableCell>{owners}.</TableCell>
            <TableCell>{natureOfInterest}</TableCell>
            <TableCell>
              <p>
                {`${cell ? `${cell} cell, ` : ""}${village ? `${village} village, ` : ""}${parish ? `${parish} parish, ` : ""}${subCounty ? `${subCounty}, ` : ""} ${district}`}
              </p>
              {location && <p>Precise location: {location}</p>}
            </TableCell>
            <TableCell>
              <p className="font-semibold">{street}</p>
              {parcel && (
                <p className="italic">{`${parcel.plotNumber ? `Plot ${parcel.plotNumber}, ` : ""} ${parcel.blockNumber ? `Block ${parcel.blockNumber}` : ""}`}</p>
              )}
            </TableCell>
            <TableCell>
              {_landUseType === "OTHERS" ? otherLandUseType : landUseType}
            </TableCell>
            <TableCell>
              <Badge variant={variant}>{applicationStatus}</Badge>
              {(status === "DEFERRED" || status === "REJECTED") &&
                inspection && <p>{inspection.visitReport}</p>}
            </TableCell>
          </TableRow>
        );
      })}
      <TableRow>
        <TableCell colSpan={5} className="uppercase  text-lg  text-center">
          {numberOfItems === 0
            ? `No ${decision} land applications`
            : ` ${decision} (${formatNumber(parentApplications.length)})`}
        </TableCell>
      </TableRow>
    </>
  );
}

function getDecisionItemCount({
  decision,
  parentApplications: _parentApplications,
}: {
  parentApplications: ApplicationData[];
  decision: ApplicationStatus;
}) {
  const { title } = applicationStatuses[decision];
  const parentApplications = _parentApplications.filter(
    (p) => p.status === decision,
  );
  return `${formatNumber(parentApplications.length)} ${title}`;
}
