import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allPaymentMethods, paymentMethods } from "@/lib/enums";
import { PaymentSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<PaymentSchema>;
}
export default function FieldPaymentMethod({ form }: Props) {
  return (
    <FormField
      control={form.control}
      name="paymentMethod"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Payment method</FormLabel>
          <Select onValueChange={(v) => field.onChange(v)}>
            <SelectTrigger className="w-full">
              <FormControl>
                <SelectValue
                  placeholder={"Please choose an payment method"}
                  className="w-full"
                />
              </FormControl>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Allowed payment methods</SelectLabel>
                {allPaymentMethods.map((paymentMethod) => {
                  const { title } = paymentMethods[paymentMethod];
                  return (
                    <SelectItem key={paymentMethod} value={paymentMethod}>
                      {title}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
