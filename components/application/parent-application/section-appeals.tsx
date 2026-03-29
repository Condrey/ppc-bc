import { EmptyContainer } from "@/components/query-container/empty-container";
import { Button } from "@/components/ui/button";
import { AppealData } from "@/lib/types";

export default function SectionAppeals({ appeals }: { appeals: AppealData[] }) {
  return (
    <>
      {!appeals.length ? (
        <EmptyContainer
          title="No appeals were made"
          description="This application has not been appealed against. If you are unsatisfied with the decision on this application, you can file an appeal to have it reviewed again."
        >
          <Button>File an Appeal</Button>
        </EmptyContainer>
      ) : (
        <div className="flex flex-col gap-6">
          {appeals.map((appeal, index) => {
            const { id, appealReason, decidedBy } = appeal;
            return <div key={id} className="flex  gap-4"></div>;
          })}
        </div>
      )}
    </>
  );
}
