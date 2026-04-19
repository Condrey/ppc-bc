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
      const queryKey2: QueryKey = ["parcel", variables.input.parcel?.id];
      const queryKey3: QueryKey = ["application", variables.applicationId];
      const queryKey4: QueryKey = [
        "parent-application",
        variables.input.application?.type,
      ];
      await Promise.all([
        await queryClient.cancelQueries({ queryKey }),
        await queryClient.cancelQueries({ queryKey: queryKey2 }),
        await queryClient.cancelQueries({ queryKey: queryKey3 }),
        await queryClient.cancelQueries({ queryKey: queryKey4 }),
      ]);
      if (typeof data === "string") {
        toast.warning(data);
      } else {
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: queryKey2 });
        queryClient.invalidateQueries({ queryKey: queryKey3 });
        queryClient.invalidateQueries({ queryKey: queryKey4 });

        toast.success("success", {
          description: variables.input.id ? "Parcel updated" : "Parcel added",
        });
      }
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to manipulate parcel");
    },
  });
}
