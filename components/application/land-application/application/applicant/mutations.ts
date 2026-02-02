"use client";
import { ApplicantData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { upsertApplicant } from "./actions";

const queryKey: QueryKey = ["applicants"];

export function useUpsertApplicantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertApplicant,
    async onSuccess(data, variables) {
      const queryKey2: QueryKey = ["applicant", variables.id];
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });

      queryClient.setQueryData<ApplicantData[]>(queryKey, (oldData) => {
        if (!oldData) return;
        if (!variables.id) {
          return [data, ...oldData];
        } else {
          return oldData.map((d) => (d.id === data.id ? data : d));
        }
      });
      queryClient.invalidateQueries({ queryKey: queryKey2 });

      toast.success("success", {
        description: !variables.id ? "Applicant added" : "Applicant updated",
      });
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to manipulate applicant");
    },
  });
}
