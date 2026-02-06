"use client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { upsertFeeAssessment } from "./action";

const queryKey: QueryKey = ["parent-applications"];

export function useUpsertFeeAssessmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertFeeAssessment,
    async onSuccess(data, variables) {
      const queryKey2: QueryKey = [
        "fee-assessment",
        "application",
        variables.applicationId,
      ];
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });

      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });

      toast.success("success", {
        description: !variables.id
          ? "Fee Assessment added"
          : "Fee Assessment updated",
      });
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to manipulate fee Assessment");
    },
  });
}
