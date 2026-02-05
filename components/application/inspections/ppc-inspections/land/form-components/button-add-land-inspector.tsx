"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { roles } from "@/lib/enums";
import { UserData } from "@/lib/types";
import { LandApplicationSchema } from "@/lib/validation";
import { useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

interface Props extends ButtonProps {
  thisForm: UseFormReturn<LandApplicationSchema>;
  committeeMembers: UserData[];
}
export default function ButtonAddLandInspector({
  thisForm: form,
  committeeMembers,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);
  const { append } = useFieldArray({
    control: form.control,
    name: "inspection.inspectorsIds",
  });
  const fields = form.getValues("inspection.inspectorsIds");
  function onButtonClick() {
    setOpen(true);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button title={"Add inspector"} {...props} onClick={onButtonClick} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add inspector</DialogTitle>
        </DialogHeader>

        <Command>
          <CommandInput placeholder="Search member..." className="h-9" />
          <CommandList>
            <CommandEmpty className="p-3 flex flex-col justify-center max-w-sm text-center items-center gap-2">
              <p className="inline-block">
                No applicant with that name exists in the system, please check
                the spelling.
              </p>
              {/* <ButtonAddEditApplicant variant={"secondary"}>
                      Add new Applicant
                    </ButtonAddEditApplicant> */}
            </CommandEmpty>
            <CommandGroup>
              {committeeMembers.map((member) => {
                const { title: role } = roles[member.role];
                const wasSelected = fields!
                  .map((c) => c.userId)
                  .includes(member.id);
                return (
                  <CommandItem
                    key={member.id}
                    value={member.name + member.email + member.username}
                    disabled={wasSelected}
                    onSelect={() => {
                      if (!wasSelected) {
                        append({ userId: member.id });
                        form.clearErrors("inspection.inspectorsIds");
                        // setOpen(false);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span>{member.name}</span> - <span>{role}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs mr-3 opacity-25">
                          {wasSelected && "(already selected)"}
                        </span>
                        <Checkbox checked={wasSelected} />
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        <DialogFooter>
          <Button
            type="button"
            variant={"outline"}
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
          <Button type="button" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
