"use client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { upsertMinute } from "./action";

const queryKey: QueryKey = ["meetings"];

export function useAddEditMinuteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertMinute,
    async onSuccess(data, variables) {
      const queryKey2: QueryKey = ["meeting", variables.meetingId];
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });

      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });

      toast.success("success", {
        description: !variables.id ? "Minute added" : "Minute updated",
      });
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to manipulate minute");
    },
  });
}
