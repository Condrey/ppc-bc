import { EmptyContainer } from "@/components/query-container/empty-container";
import { Button } from "@/components/ui/button";
import { ResubmissionData } from "@/lib/types";

export default function SectionResubmissions({
  resubmissions,
}: {
  resubmissions: ResubmissionData[];
}) {
  return (
    <>
      {!resubmissions.length ? (
        <EmptyContainer
          title="No resubmissions were made or required"
          description="This application has not been resubmitted. In the scenario where your application was rejected or deferred, you can make the necessary changes and resubmit it for reconsideration."
        >
          <Button>Resubmit changes</Button>
        </EmptyContainer>
      ) : (
        <div className="flex flex-col gap-6">
          {resubmissions.map((resubmission, index) => {
            const { id, resubmittedBy, reason, createdAt } = resubmission;
            return <div key={id} className="flex  gap-4"></div>;
          })}
        </div>
      )}
    </>
  );
}
