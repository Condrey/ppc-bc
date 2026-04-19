import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeMedia } from "./action";

const queryKey: QueryKey = ["parent-applications"];

export function useDeleteMediaMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: removeMedia,
    onSuccess: async (data, variables) => {
      const queryKey2: QueryKey = ["inspection", "applicationId"];
      const queryKey3: QueryKey = ["meeting"];
      const queryKey4: QueryKey = ["parent-application"];
      const queryKey5: QueryKey = ["application", variables.applicationId];

      await Promise.all([
        await queryClient.cancelQueries({ queryKey }),
        await queryClient.cancelQueries({ queryKey: queryKey2 }),
        await queryClient.cancelQueries({ queryKey: queryKey3 }),
        await queryClient.cancelQueries({ queryKey: queryKey4 }),
        await queryClient.cancelQueries({ queryKey: queryKey5 }),
      ]);

      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey2 });
      queryClient.invalidateQueries({ queryKey: queryKey3 });
      queryClient.invalidateQueries({ queryKey: queryKey4 });
      queryClient.invalidateQueries({ queryKey: queryKey5 });

      // Return a context with the previous state to rollback in case of error
      toast.success("Success", {
        description: "Media deleted successfully",
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
