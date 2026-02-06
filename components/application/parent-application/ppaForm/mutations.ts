"use client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  upsertPpaForm1ForBuildingApplication,
  upsertPpaForm1ForLandApplication,
} from "./actions";

export function useUpsertPpaForm1LandApplicationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertPpaForm1ForLandApplication,
    async onSuccess(data, variables) {
      const queryKey: QueryKey = ["parent-applications"];
      const queryKey2: QueryKey = ["land-application", variables.id];
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });
      toast.success("success", {
        description: !variables.id
          ? "PPA Form1 for land application added successfully"
          : "PPA Form1 for land application updated",
      });
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to manipulate PPA Form1 for land application");
    },
  });
}

export function useUpsertPpaForm1BuildingApplicationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertPpaForm1ForBuildingApplication,
    async onSuccess(data, variables) {
      const queryKey: QueryKey = ["parent-applications"];
      const queryKey2: QueryKey = ["building-application", variables.id];
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });
      toast.success("success", {
        description: !variables.id
          ? "PPA Form1 for building application added successfully"
          : "PPA Form1 for building application updated",
      });
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to manipulate PPA Form1 for building application");
    },
  });
}
