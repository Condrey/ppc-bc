import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MeetingSchema } from "@/lib/validation";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<MeetingSchema>;
}
export default function FieldSendInvitations({ form }: Props) {
  const sendInvitations = form.watch("sendInvitations");
  return (
    <Item variant={"muted"}>
      <ItemContent className="space-y-5">
        <FormField
          control={form.control}
          name="sendInvitations"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Label htmlFor="send-invitations" className="cursor-pointer">
                  <Checkbox
                    id="send-invitations"
                    className="float-start mr-0.5"
                    checked={field.value || false}
                    onCheckedChange={(checked) => {
                      const newValue = Boolean(checked);
                      field.onChange(newValue);
                      if (newValue === false) {
                        form.setValue("message", undefined);
                      }
                    }}
                  />
                  <ItemTitle>
                    {"Send meeting invitations to committee"}
                  </ItemTitle>
                </Label>
              </FormControl>
              <FormDescription />
            </FormItem>
          )}
        />
        {sendInvitations && (
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem
                className={cn(
                  " transition-all",
                  sendInvitations
                    ? "animate-collapsible-down"
                    : "animate-collapsible-up",
                )}
              >
                <FormLabel>Invitation Message</FormLabel>
                <FormControl>
                  <Textarea
                    cols={3}
                    placeholder="describe the invitation message"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </ItemContent>
    </Item>
  );
}
