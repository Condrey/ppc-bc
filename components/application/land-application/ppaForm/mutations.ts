"use client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { upsertPpaForm1 } from "./actions";

export function useUpsertPpaForm1Mutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertPpaForm1,
    async onSuccess(data, variables) {
      const queryKey: QueryKey = ["land-applications"];
      const queryKey2: QueryKey = ["land-application", variables.id];
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });
      toast.success("success", {
        description: !variables.id ? "PpaForm1 added" : "PpaForm1 updated",
      });
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to manipulate ppaForm1");
    },
  });
}
