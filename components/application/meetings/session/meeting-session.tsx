import { EmptyContainer } from "@/components/query-container/empty-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationStatus } from "@/lib/generated/prisma/enums";
import { MeetingData } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import ApplicationsContainer from "./applications-container";

interface Props {
  meeting: MeetingData;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}
export default function MeetingSession({ meeting, open, onOpenChange }: Props) {
  const { minute, title: meetingTitle, applications } = meeting;
  const approvedApplications = applications.filter(
    (app) => app.status === ApplicationStatus.APPROVED,
  );
  const rejectedApplications = applications.filter(
    (app) => app.status === ApplicationStatus.REJECTED,
  );
  const deferredApplications = applications.filter(
    (app) => app.status === ApplicationStatus.DEFERRED,
  );
  const pendingStatuses: ApplicationStatus[] = [
    ApplicationStatus.SUBMITTED,
    ApplicationStatus.UNDER_REVIEW,
    ApplicationStatus.INSPECTED,
  ];
  const pendingApplications = applications.filter((app) =>
    pendingStatuses.includes(app.status),
  );

  return (
    <Tabs defaultValue={"pending"} activationMode="manual">
      <TabsList className="w-full group-data-[orientation=horizontal]/tabs:h-fit *:py-2">
        <TabsTrigger value="pending">
          Pending <Counter count={pendingApplications.length} />{" "}
        </TabsTrigger>
        <TabsTrigger value="approved">
          Approved <Counter count={approvedApplications.length} />
        </TabsTrigger>
        <TabsTrigger value="deferred">
          Deferred <Counter count={deferredApplications.length} />
        </TabsTrigger>
        <TabsTrigger value="rejected">
          Rejected <Counter count={rejectedApplications.length} />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pending">
        {!pendingApplications.length ? (
          <EmptyContainer
            title="No pending applications"
            description="There are no more pending applications under this meeting"
          />
        ) : (
          <ApplicationsContainer applications={pendingApplications} />
        )}
      </TabsContent>
      <TabsContent value="approved">
        {!approvedApplications.length ? (
          <EmptyContainer
            title="No approved applications"
            description="This meeting may not have any approved applications as yet."
          />
        ) : (
          <ApplicationsContainer applications={approvedApplications} />
        )}
      </TabsContent>
      <TabsContent value="deferred">
        {!deferredApplications.length ? (
          <EmptyContainer
            title="No deferred applications"
            description="This meeting may not have any deferred applications as yet."
          />
        ) : (
          <ApplicationsContainer applications={deferredApplications} />
        )}{" "}
      </TabsContent>
      <TabsContent value="rejected">
        {!rejectedApplications.length ? (
          <EmptyContainer
            title="No rejected applications"
            description="This meeting may not have any rejected applications as yet."
          />
        ) : (
          <ApplicationsContainer applications={rejectedApplications} />
        )}{" "}
      </TabsContent>
    </Tabs>
  );
}

function Counter({ count }: { count: number }) {
  return (
    <span
      className={cn(
        "-translate-y-2",
        count > 0
          ? "bg-destructive min-h-4 min-w-4 px-1 rounded-full text-destructive-foreground"
          : "bg-primary min-h-4 min-w-4 px-1 rounded-full text-primary-foreground",
      )}
    >
      {formatNumber(count)}
    </span>
  );
}
