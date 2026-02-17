"use client";
import { applicationStatuses } from "@/lib/enums";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { decideApplication, startMeeting, upsertMeeting } from "./action";

const queryKey: QueryKey = ["meetings"];

export function useUpsertMeetingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertMeeting,
    async onSuccess(data, variables) {
      const queryKey2: QueryKey = ["meeting", variables.id];
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });

      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });

      toast.success("success", {
        description: !variables.id ? "Meeting added" : "Meeting updated",
      });
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to manipulate meeting");
    },
  });
}

export function useStartMeetingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startMeeting,
    async onSuccess(data, meetingId) {
      const queryKey2: QueryKey = ["meeting", meetingId];
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });

      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });

      toast.success("success", {
        description: "Meeting started",
      });
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to start meeting");
    },
  });
}

export function useDecideApplicationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: decideApplication,
    async onSuccess(data, variables) {
      const { title } = applicationStatuses[variables.decision];
      const queryKey2: QueryKey = ["meeting", variables.application.meetingId];
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });

      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });

      toast.success("success", {
        description: `Application has been ${title}`,
      });
    },
    onError(error, variables) {
      const { title } = applicationStatuses[variables.decision];
      console.error(error);
      toast.error(`Failed to ${title} application`);
    },
  });
}
