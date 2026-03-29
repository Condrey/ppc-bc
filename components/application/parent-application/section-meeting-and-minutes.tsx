import { TypographyH4 } from "@/components/headings";
import { EmptyContainer } from "@/components/query-container/empty-container";
import {
  applicationStatuses,
  committees,
  meetingStatuses,
  roles,
} from "@/lib/enums";
import { ApplicationStatus, Role } from "@/lib/generated/prisma/enums";
import { MeetingAndMinuteData, MinuteData } from "@/lib/types";
import { getMeetingNumber } from "@/lib/utils";
import { formatDate } from "date-fns";

interface Props {
  meeting: MeetingAndMinuteData | undefined | null;
  minuteNumber: string | null | undefined;
  status: ApplicationStatus;
}
export default function SectionMeetingAndMinutes({
  meeting,
  minuteNumber,
  status: _applicationStatus,
}: Props) {
  if (!meeting) {
    return (
      <EmptyContainer
        title="No meeting held yet"
        description="This application has not yet been adopted for a meeting as yet"
      />
    );
  }
  const {
    title,
    venue,
    committee: _committee,
    endedAt,
    happeningOn,
    meetingNo,
    postponedOn,
    status: _status,
    minute,
  } = meeting;
  const date = postponedOn ? postponedOn : happeningOn;
  const meetingNumber = getMeetingNumber(meetingNo, date);
  const { title: committee } = committees[_committee];
  const { title: status } = meetingStatuses[_status];
  const { title: applicationStatus } = applicationStatuses[_applicationStatus];
  return (
    <div className="max-w-5xl *:text-justify *:hyphens-auto space-y-6 ">
      <p className="">
        This application was adopted in a meeting titled{" "}
        <strong>{title}</strong> scheduled for{" "}
        <strong>{formatDate(date, "PPPPpp")}</strong> in a venue known as{" "}
        <cite>{venue}</cite> under meeting number{" "}
        <strong>{meetingNumber}</strong> by the <strong>{committee}</strong>.
      </p>

      <p>
        {endedAt && (
          <>
            The meeting ended on{" "}
            <strong>{formatDate(endedAt, "PPPPpp")}</strong>.{" "}
          </>
        )}
        The current status of the meeting is <strong>{status}</strong>. The
        minutes of the meeting can be found below;
      </p>

      {!minute ? (
        <strong className="italic text-destructive">
          Unfortunately, this meeting has not yet been minuted till now
        </strong>
      ) : (
        <MinutesOfTheMeeting minutes={minute} />
      )}
      {minuteNumber && (
        <p className="font-semibold border-l border-warning ps-3">
          Minute number for this application is {minuteNumber}
        </p>
      )}
      <p className="font-semibold border-l border-warning ps-3">
        During the meeting, it was resolved that your application be{" "}
        {applicationStatus}
      </p>
    </div>
  );
}

function MinutesOfTheMeeting({ minutes }: { minutes: MinuteData }) {
  const {
    chairedBy: { name: chairpersonName, role: _chairpersonRole },
    writtenBy: { name: secretaryName, role: _secretaryRole },
    presentMembers,
  } = minutes;
  const getRoleTitle = (role: Role) => roles[role].title;
  const chairpersonRole = getRoleTitle(_chairpersonRole);
  const secretaryRole = getRoleTitle(_secretaryRole);
  return (
    <div>
      <p>
        The minutes was chaired by {chairpersonName} ({chairpersonRole}) and
        written by {secretaryName} ({secretaryRole}) as the secretary.
      </p>
      <div>
        <TypographyH4
          text="Present members during meeting;"
          className="underline"
        />
        <ul className="list-decimal list-inside">
          {presentMembers.map((m) => (
            <li key={m.id}>
              {m.name} - <strong>{getRoleTitle(m.role)}</strong>{" "}
              <span className="text-muted-foreground">({m.email})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
