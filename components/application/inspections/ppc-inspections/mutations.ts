"use client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addInspection,
  editBuildingInspection,
  editLandInspection,
  removeInspectionMedia,
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
      const queryKey4: QueryKey = ["parent-application"];
      await Promise.all([
        await queryClient.cancelQueries({ queryKey }),
        await queryClient.cancelQueries({ queryKey: queryKey2 }),
        await queryClient.cancelQueries({ queryKey: queryKey3 }),
        await queryClient.cancelQueries({ queryKey: queryKey4 }),
      ]);
      if (typeof data === "string") {
        toast.warning(data);
        return;
      } else {
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: queryKey2 });
        queryClient.invalidateQueries({ queryKey: queryKey3 });
        queryClient.invalidateQueries({ queryKey: queryKey4 });

        toast.success("success", {
          description: "Inspection added",
        });
      }
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
      const queryKey4: QueryKey = ["parent-application"];

      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });
      await queryClient.cancelQueries({ queryKey: queryKey3 });
      await queryClient.cancelQueries({ queryKey: queryKey4 });
      if (typeof data === "string") {
        toast.warning(data);
        return;
      } else {
        await Promise.all([
          await queryClient.cancelQueries({ queryKey }),
          await queryClient.cancelQueries({ queryKey: queryKey2 }),
          await queryClient.cancelQueries({ queryKey: queryKey3 }),
          await queryClient.cancelQueries({ queryKey: queryKey4 }),
        ]);

        toast.success("success", {
          description: "Inspection completed",
        });
      }
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
      const queryKey4: QueryKey = ["parent-application"];

      await Promise.all([
        await queryClient.cancelQueries({ queryKey }),
        await queryClient.cancelQueries({ queryKey: queryKey2 }),
        await queryClient.cancelQueries({ queryKey: queryKey3 }),
        await queryClient.cancelQueries({ queryKey: queryKey4 }),
      ]);
      if (typeof data === "string") {
        toast.warning(data);
        return;
      } else {
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: queryKey2 });
        queryClient.invalidateQueries({ queryKey: queryKey3 });
        queryClient.invalidateQueries({ queryKey: queryKey4 });

        toast.success("success", {
          description: "Inspection completed",
        });
      }
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to manipulate inspection");
    },
  });
}

export function useDeleteInspectionMediaMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: removeInspectionMedia,
    onSuccess: async (data, variables) => {
      const queryKey2: QueryKey = ["inspection", "applicationId"];
      const queryKey3: QueryKey = ["meeting"];
      const queryKey4: QueryKey = ["parent-application"];

      await Promise.all([
        await queryClient.cancelQueries({ queryKey }),
        await queryClient.cancelQueries({ queryKey: queryKey2 }),
        await queryClient.cancelQueries({ queryKey: queryKey3 }),
        await queryClient.cancelQueries({ queryKey: queryKey4 }),
      ]);

      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });
      queryClient.invalidateQueries({ queryKey: queryKey3 });
      queryClient.invalidateQueries({ queryKey: queryKey4 });

      // Return a context with the previous state to rollback in case of error
      toast.success("Success", {
        description: "inspection media deleted successfully",
      });
    },
    onError(error, variables, context) {
      console.error(error);
      toast.error("Failed", {
        description: "Something went wrong. Please try again.",
      });
    },
  });

  return mutation;
}
