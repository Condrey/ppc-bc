"use client";

import {
  Form,
  FormControl,
  FormField,
  FormFooter,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/ui/loading-button";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { updatePasswordSchema, UpdatePasswordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updatePassword } from "./action";

export function FormUpdatePassword({ userId }: { userId?: string }) {
  const [isPending, startTransition] = useTransition();
  const [dbResult, setDbResult] = useState<{
    error: null | string;
    message: null | string;
  }>({ error: null, message: null });
  const form = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      repeatPassword: "",
    },
  });

  function submit(input: UpdatePasswordSchema) {
    setDbResult({ error: null, message: null });
    startTransition(async () => {
      const { error, message } = await updatePassword({ userId, input });
      setDbResult({ error, message });

      if (error) {
        toast.error(error);
      } else {
        toast.success(message);
        form.clearErrors();
        form.reset();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="enter current password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="enter new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Repeat password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Repeat the above password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {dbResult && (
          <div
            className={cn(
              "w-full px-3 py-1.5 rounded-md hidden ",
              dbResult.error && "text-destructive bg-destructive/20 block",
              dbResult.message && "text-success bg-success/20 block",
            )}
          >
            <AlertCircleIcon className="size-4 mr-1 inline" />{" "}
            {dbResult.error || dbResult.message}
          </div>
        )}
        <FormFooter>
          <LoadingButton loading={isPending}>Update</LoadingButton>
        </FormFooter>
      </form>
    </Form>
  );
}
