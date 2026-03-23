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
import { applicationStatuses, landUseTypes } from "@/lib/enums";
import { ApplicationStatus } from "@/lib/generated/prisma/enums";
import { ApplicationData, MeetingData } from "@/lib/types";
import { formatNumber, getApplicationNumber, getLocation } from "@/lib/utils";

export default function SectionBuildingApplications({
  meeting,
}: {
  meeting: MeetingData;
}) {
  const { applications } = meeting;
  const parentApplications = applications.filter((a) => a.type === "BUILDING");

  return (
    <>
      {!parentApplications.length ? (
        <EmptyContainer
          title="No Building Application"
          description="There are no building Applications that were reviewed in this meeting."
          className={"[&_svg]:hidden md:p-0 p-3"}
        />
      ) : (
        <div>
          <Table className="table border max-w-7xl mx-auto">
            <TableHeader>
              <TableRow className="*:font-bold *:border">
                <TableHead>S/N</TableHead>
                <TableHead>NAMES</TableHead>
                <TableHead>LOCATION</TableHead>
                <TableHead>LAND USE</TableHead>
                <TableHead>RECOMMENDATION</TableHead>
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
        const {
          id,
          buildingApplication,
          owners,
          status,
          inspections,
          applicationNo,
          year,
          type,
        } = parentApplication;
        const inspection = !inspections.length
          ? undefined
          : inspections[inspections.length - 1];
        if (!buildingApplication) return null;
        const {
          address,
          landUse: { landUseType: _landUseType, otherLandUseType },
        } = buildingApplication;
        const { location } = address;
        const { formDesc } = landUseTypes[_landUseType];
        const { title: applicationStatus, variant } =
          applicationStatuses[status];
        return (
          <TableRow key={id} className="*:border">
            <TableCell>
              {String(initialIndex + index + 1).padStart(2, "0")}
            </TableCell>
            <TableCell className="space-y-1.5">
              <p className="capitalize">{owners}.</p>
              <p className="font-semibold text-muted-foreground slashed-zero font-mono">
                {getApplicationNumber(applicationNo, year, type)}
              </p>
            </TableCell>
            <TableCell>
              <p>{getLocation(address)} </p>
              {location && <p>Precise location: {location}</p>}
            </TableCell>
            <TableCell>
              {_landUseType === "OTHERS" ? otherLandUseType : formDesc}
            </TableCell>
            <TableCell className="space-y-1.5">
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
            ? `No ${decision} building applications`
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
