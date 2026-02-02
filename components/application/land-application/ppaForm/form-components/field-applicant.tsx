import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ApplicantData } from "@/lib/types";
import { LandApplicationSchema } from "@/lib/validation";
import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import ButtonAddEditApplicant from "../../application/applicant/button-add-edit-applicant";
import CommandItemApplicant, {
  ChosenApplicantCommandItem,
} from "../../application/applicant/command-item-applicant";

interface Props {
  form: UseFormReturn<LandApplicationSchema>;
  applicants: ApplicantData[];
}
export default function FieldApplicant({ form, applicants }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <FormField
      control={form.control}
      name="application.applicant"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Applicant</FormLabel>
          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {field.value ? (
                    <ChosenApplicantCommandItem
                      applicant={applicants.find(
                        (applicant) => applicant.id === field.value?.id,
                      )}
                    />
                  ) : (
                    "Choose applicant..."
                  )}
                  <ChevronsUpDownIcon className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search member..." className="h-9" />
                <CommandList>
                  <CommandEmpty className="p-3 flex flex-col justify-center max-w-sm text-center items-center gap-2">
                    <p className="inline-block">
                      No applicant with that name exists in the system, please
                      check the spelling.
                    </p>
                    <ButtonAddEditApplicant variant={"secondary"}>
                      Add new Applicant
                    </ButtonAddEditApplicant>
                  </CommandEmpty>
                  <CommandGroup>
                    {applicants.map((applicant) => (
                      <CommandItem
                        key={applicant.id}
                        value={
                          applicant.name +
                          applicant.contact +
                          applicant.email +
                          applicant.address
                        }
                        onSelect={() => {
                          form.setValue("application.applicant", applicant);
                          form.clearErrors("application.applicant");
                          setOpen(false);
                        }}
                      >
                        <CommandItemApplicant
                          isChecked={field.value?.id === applicant.id}
                          applicant={applicant}
                          avatarSize="45px"
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
