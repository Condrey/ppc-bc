import UserAvatar from "@/app/(auth)/user-avatar";
import { EmptyContainer } from "@/components/query-container/empty-container";
import { Badge } from "@/components/ui/badge";
import { roles, workflowStageTypes } from "@/lib/enums";
import { WorkflowStage } from "@/lib/generated/prisma/client";
import { ApplicationDecision } from "@/lib/generated/prisma/enums";
import { WorkflowStageData } from "@/lib/types";
import { calculateDuration, cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { CheckIcon, ClockIcon, PauseCircleIcon, XIcon } from "lucide-react";

export default function SectionWorkflowStages({
  workflowStages: _workflowStages,
}: {
  workflowStages: WorkflowStageData[];
}) {
  const workflowStages = _workflowStages.sort((a, b) => a.step - b.step);
  return (
    <>
      {!workflowStages.length ? (
        <EmptyContainer
          title="No registered workflow"
          description="There are no workflow stages registered for this application."
        />
      ) : (
        <div className="flex flex-col ">
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
              <div key={id} className="flex max-w-4xl gap-4">
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
                        "w-0.5 flex-1 mt-0.5",
                        state === "completed"
                          ? "bg-success"
                          : "bg-muted-foreground",
                      )}
                      style={{ minHeight: 60 }}
                    />
                  )}
                </div>
                {/* CONTENT  */}
                <div
                  className={cn(
                    "pb-6 flex-1 border p-4 mb-6",
                    state === "completed"
                      ? "bg-success/5"
                      : state === "current"
                        ? "bg-muted-foreground/20"
                        : "",
                  )}
                >
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
                    {decidedAt && (
                      <span className="font-normal text-sm text-foreground capitalize">
                        {calculateDuration({
                          startDate: startedAt,
                          endDate: decidedAt,
                        })}
                      </span>
                    )}
                    {state !== "upcoming" && (
                      <p>
                        {formatDate(new Date(startedAt), "PPp")}
                        {decidedAt && (
                          <span>
                            {" "}
                            - {formatDate(new Date(decidedAt), "PPp")}
                          </span>
                        )}
                      </p>
                    )}

                    {decidedAt && (
                      <div className="">
                        {decidedBy && (
                          <div className="mt-3 text-sm flex items-center gap-2">
                            <UserAvatar
                              avatarUrl={decidedBy.avatarUrl}
                              className="size-16"
                            />
                            <div>
                              <p className="text-foreground">Action Officer</p>
                              <p className=" uppercase">{decidedBy.name}</p>
                              <p>The {roles[decidedBy.role].title}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Remarks  */}
                  {remarks && (
                    <p
                      className={cn(
                        "mt-2 max-w-prose  min-h-20 border p-2 bg-warning/5 border-l-warning pl-3 text-sm text-muted-foreground",
                        state === "completed"
                          ? "bg-success/10 border-l-success border-l-8 text-success"
                          : state === "current"
                            ? "bg-muted-foreground/10 text-shadow-2xs border-l-muted-foreground border-l-8 text-muted-foreground"
                            : "border-l-8",
                      )}
                    >
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
