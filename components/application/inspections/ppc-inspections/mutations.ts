"use client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addInspection,
  editBuildingInspection,
  editLandInspection,
} from "./actions";

const queryKey: QueryKey = ["parent-applications"];

export function useAddInspectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addInspection,
    async onSuccess(data, variables) {
      const queryKey2: QueryKey = [
        "inspection",
        "applicationId",
        variables.applicationId,
      ];
      const queryKey3: QueryKey = ["meeting"];
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });
      await queryClient.cancelQueries({ queryKey: queryKey3 });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });
      queryClient.invalidateQueries({ queryKey: queryKey3 });

      toast.success("success", {
        description: "Inspection added",
      });
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to manipulate inspection");
    },
  });
}

export function useEditLandInspectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editLandInspection,
    async onSuccess(data, variables) {
      const queryKey2: QueryKey = [
        "inspection",
        "applicationId",
        variables.landApplication.application?.id,
      ];
      const queryKey3: QueryKey = ["meeting"];
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });
      await queryClient.cancelQueries({ queryKey: queryKey3 });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });
      queryClient.invalidateQueries({ queryKey: queryKey3 });

      toast.success("success", {
        description: "Inspection completed",
      });
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to manipulate inspection");
    },
  });
}

export function useEditBuildingInspectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editBuildingInspection,
    async onSuccess(data, variables) {
      const queryKey2: QueryKey = [
        "inspection",
        "applicationId",
        variables.buildingApplication.application?.id,
      ];
      const queryKey3: QueryKey = ["meeting"];
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });
      await queryClient.cancelQueries({ queryKey: queryKey3 });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });
      queryClient.invalidateQueries({ queryKey: queryKey3 });

      toast.success("success", {
        description: "Inspection completed",
      });
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to manipulate inspection");
    },
  });
}
