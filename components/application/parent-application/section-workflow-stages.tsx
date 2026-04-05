import UserAvatar from "@/app/(auth)/user-avatar";
import { EmptyContainer } from "@/components/query-container/empty-container";
import { Badge } from "@/components/ui/badge";
import { roles, workflowStageTypes } from "@/lib/enums";
import { WorkflowStage } from "@/lib/generated/prisma/client";
import { ApplicationDecision } from "@/lib/generated/prisma/enums";
import { WorkflowStageData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { CheckIcon, ClockIcon, PauseCircleIcon, XIcon } from "lucide-react";

export default function SectionWorkflowStages({
  workflowStages,
}: {
  workflowStages: WorkflowStageData[];
}) {
  return (
    <>
      {!workflowStages.length ? (
        <EmptyContainer
          title="No registered workflow"
          description="There are no workflow stages registered for this application."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {workflowStages.map((step, index) => {
            const state = getState(step, index, workflowStages);
            const isLast = index === workflowStages.length - 1;
            const {
              id,
              decision,
              stage,
              startedAt,
              decidedAt,
              remarks,
              decidedBy,
              status,
              group,
            } = step;
            const { title: workflowStage } = workflowStageTypes[stage];
            return (
              <div key={id} className="flex  gap-4">
                {/* indicator   */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full border text-sm",
                      state === "completed"
                        ? "bg-success text-success-foreground border-success"
                        : state === "current"
                          ? "  bg-muted-foreground text-muted "
                          : "border-muted-foreground text-muted-foreground",
                    )}
                  >
                    {decision === "REJECTED" ? (
                      <XIcon className="size-4 " />
                    ) : decision === "DEFERRED" ? (
                      <PauseCircleIcon className="size-4 " />
                    ) : state === "completed" ? (
                      <CheckIcon className="size-4" />
                    ) : state === "current" ? (
                      <ClockIcon className="size-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        "w-px flex-1 mt-0.5",
                        state === "completed" ? "bg-success" : "bg-muted",
                      )}
                      style={{ minHeight: 60 }}
                    />
                  )}
                </div>
                {/* CONTENT  */}
                <div className="pb-6 flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={cn(
                        "text-sm font-semibold uppercase",
                        state === "completed"
                          ? "text-success"
                          : "text-muted-foreground",
                      )}
                    >
                      {group || workflowStage}{" "}
                      <span className="font-normal">({status})</span>
                    </p>
                    <DecisionBadge decision={decision} />
                  </div>
                  {/* Timeline remarks  */}
                  <div className="mt-1 text-xs text-muted-foreground space-y-1">
                    {state !== "upcoming" && (
                      <p>
                        <span className="italic text-success">Started:</span>{" "}
                        {formatDate(new Date(startedAt), "PPP p")}
                      </p>
                    )}

                    {decidedAt && (
                      <div className="">
                        <p>
                          <span className="italic text-destructive">
                            Ended:
                          </span>{" "}
                          {formatDate(new Date(decidedAt), "PPP p")}
                        </p>
                        {decidedBy && (
                          <div className="mt-3 text-sm flex gap-2">
                            <UserAvatar
                              avatarUrl={decidedBy.avatarUrl}
                              size={25}
                            />
                            <div>
                              <p className=" uppercase">{decidedBy.name}</p>
                              <p>{roles[decidedBy.role].title}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Remarks  */}
                  {remarks && (
                    <p className="mt-2  border-l border-l-warning pl-3 text-sm text-muted-foreground">
                      {remarks}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function getState(
  step: WorkflowStage,
  index: number,
  steps: WorkflowStage[],
): "completed" | "current" | "upcoming" {
  if (step.status === "COMPLETED") return "completed";

  const firstActive = steps.findIndex((s) => s.status !== "COMPLETED");

  if (index === firstActive) return "current";

  return index > firstActive ? "upcoming" : "completed";
}

function DecisionBadge({
  decision,
}: {
  decision?: ApplicationDecision | null;
}) {
  if (!decision || decision === "PENDING") return null;

  return (
    <Badge
      variant={
        decision === "APPROVED"
          ? "success"
          : decision === "REJECTED"
            ? "destructive"
            : "warning"
      }
    >
      {decision}
    </Badge>
  );
}
