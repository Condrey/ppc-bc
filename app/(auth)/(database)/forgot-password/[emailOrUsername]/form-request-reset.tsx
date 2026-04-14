/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormFooter } from "@/components/ui/form";
import LoadingButton from "@/components/ui/loading-button";
import { passwordResetSchema, PasswordResetSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { resetPasswordAndLogin, validateEmail, verifyOtp } from "./action";
import SectionSubmitEmailUsername from "./section-submit-email-username";
import SectionSubmitOtp from "./section-submit-otp";
import SectionSubmitPassword from "./section-submit-password";

interface Props {
  emailUsername: string | null | undefined;
  isValidEmail: boolean;
}

export default function FormRequestReset({
  emailUsername,
  isValidEmail,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<number>(isValidEmail ? 2 : 1);
  const form = useForm<PasswordResetSchema>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      emailUsername: emailUsername || "",
      newPassword: "",
      repeatPassword: "",
      otp: "",
    },
  });

  function submit(input: PasswordResetSchema, event?: any) {
    const submitter = event?.nativeEvent?.submitter;
    const action = submitter?.value;

    startTransition(async () => {
      let result;
      if (action === "step-1") {
        result = await validateEmail({ input });
        if (!result.error) setStep(2);
      } else if (action === "step-2") {
        result = await verifyOtp({ input });
        if (!result.error) setStep(3);
      } else if (action === "step-3") {
        result = await resetPasswordAndLogin({ input });
      }

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(
          "A request to rest the password has been successfully sent",
        );
      }
    });
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Resetting password for {emailUsername}</CardTitle>
        <CardDescription className="text-muted-foreground ">
          To request a password reset token, please enter your email or username
          below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
            className=" w-full space-y-4"
          >
            {step === 1 && <SectionSubmitEmailUsername form={form} />}
            {step === 2 && (
              <SectionSubmitOtp
                form={form}
                handleSubmit={() => form.handleSubmit(submit)()}
              />
            )}
            {step === 3 && <SectionSubmitPassword form={form} />}
            <FormFooter>
              {step === 1 && (
                <LoadingButton value="step-1" name="action" loading={isPending}>
                  Request Reset
                </LoadingButton>
              )}
              {step === 2 && (
                <LoadingButton value="step-2" name="action" loading={isPending}>
                  Submit OTP
                </LoadingButton>
              )}
              {step === 3 && (
                <LoadingButton value="step-3" name="action" loading={isPending}>
                  Reset Password
                </LoadingButton>
              )}
            </FormFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
