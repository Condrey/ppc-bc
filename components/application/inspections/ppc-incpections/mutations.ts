"use client";
import { PaymentData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { upsertPayment } from "./actions";

const queryKey: QueryKey = ["payments"];

export function useUpsertPaymentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertPayment,
    async onSuccess(data, variables) {
      const queryKey2: QueryKey = ["payment", variables.id];
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKey2 });

      queryClient.setQueryData<PaymentData[]>(queryKey, (oldData) => {
        if (!oldData) return;
        if (!variables.id) {
          return [data, ...oldData];
        } else {
          return oldData.map((d) => (d.id === data.id ? data : d));
        }
      });
      queryClient.invalidateQueries({ queryKey: queryKey2 });

      toast.success("success", {
        description: !variables.id ? "Payment added" : "Payment updated",
      });
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to manipulate payment");
    },
  });
}
