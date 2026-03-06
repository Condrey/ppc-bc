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
import { MinuteSchema } from "@/lib/validation";
import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import ButtonAddEditUser from "@/components/application/users/button-add-edit-user";
import CommandItemUser, {
  ChosenUserCommandItem,
} from "@/components/application/users/command-item-user";
import { useCommitteeMemberQuery } from "@/components/application/users/query";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  form: UseFormReturn<MinuteSchema>;
}
export default function FieldChairPerson({ form }: Props) {
  const [open, setOpen] = useState(false);
  const query = useCommitteeMemberQuery();

  const { data: committeeMembers, status } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage="Error fetching committee members"
        query={query}
      />
    );
  }
  if (status === "pending") {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }
  if (!committeeMembers.length) {
    return (
      <EmptyContainer
        title="No members"
        description="There are no committee members in the system yet. Please add members"
      >
        <ButtonAddEditUser>Add Member</ButtonAddEditUser>
      </EmptyContainer>
    );
  }
  return (
    <FormField
      control={form.control}
      name="chairId"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Chairperson</FormLabel>
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
                    <ChosenUserCommandItem
                      user={committeeMembers.find(
                        (user) => user.id === field.value,
                      )}
                    />
                  ) : (
                    "Choose chairperson..."
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
                      No committee member with that name exists in the system,
                      please check the spelling.
                    </p>
                    <ButtonAddEditUser variant={"secondary"}>
                      Add new committee member
                    </ButtonAddEditUser>
                  </CommandEmpty>
                  <CommandGroup>
                    {committeeMembers.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={
                          user.name + user.email + user.username + user.role
                        }
                        onSelect={() => {
                          form.setValue("chairId", user.id);
                          form.clearErrors("chairId");
                          setOpen(false);
                        }}
                      >
                        <CommandItemUser
                          isChecked={field.value === user.id}
                          user={user}
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
