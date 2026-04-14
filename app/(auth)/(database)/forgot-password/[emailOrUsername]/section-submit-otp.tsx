import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import LoadingButton from "@/components/ui/loading-button";
import { PasswordResetSchema } from "@/lib/validation";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { RefreshCwIcon } from "lucide-react";
import { useTransition } from "react";
import { UseFormReturn } from "react-hook-form";
interface Props {
  form: UseFormReturn<PasswordResetSchema>;
  handleSubmit: () => void;
}
export default function SectionSubmitOtp({ form, handleSubmit }: Props) {
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <h2 className="text-muted-foreground">
        Enter the verification code that was sent to your email. If you no
        longer have access to this email, contact the administrators for further
        assistance.
      </h2>
      <FormField
        control={form.control}
        name="otp"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel htmlFor="otp-verification">
                Verification code
              </FormLabel>
              <LoadingButton
                type="button"
                variant="outline"
                size="sm"
                value="step-1"
                name="action"
                loading={isPending}
                onClick={() => startTransition(handleSubmit)}
              >
                <RefreshCwIcon />
                Resend Code
              </LoadingButton>
            </div>
            <FormControl>
              <InputOTP
                maxLength={6}
                id="otp-verification"
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                autoComplete="one-time-code"
                required
                {...field}
                value={field.value!}
              >
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator className="mx-2" />
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormMessage />{" "}
          </FormItem>
        )}
      />
    </>
  );
}
