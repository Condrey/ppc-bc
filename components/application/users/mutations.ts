"use client";
import { UserData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { upsertUser } from "./action";

const queryKey: QueryKey = ["users"];

export function useInsertUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertUser,
    async onSuccess(data, variables) {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<UserData[]>(queryKey, (oldData) => {
        if (!oldData) return;
        if (typeof data === "string") {
          toast.warning(data);
          return;
        } else {
          if (!variables.id) {
            toast.success("Member added successfully");
            return [data, ...oldData];
          } else {
            toast.success("Member updated successfully");
            return oldData.map((od) => (od.id === data.id ? data : od));
          }
        }
      });
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to manipulate management");
    },
  });
}
