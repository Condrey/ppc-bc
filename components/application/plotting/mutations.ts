"use client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { upsertParcel } from "./actions";

const queryKey: QueryKey = ["parent-applications"];

export function useUpsertParcelMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertParcel,
    async onSuccess(data, variables) {
      const queryKey2: QueryKey = ["parcel", variables.parcel?.id];
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });

      toast.success("success", {
        description: "Parcel added",
      });
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to manipulate parcel");
    },
  });
}
