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
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });

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
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });

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
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });

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
