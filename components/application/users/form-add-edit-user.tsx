import {
  Form,
  FormControl,
  FormField,
  FormFooter,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Role } from "@/lib/generated/prisma/enums";
import { UserData } from "@/lib/types";
import { SignUpSchema, signUpSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import FieldRole from "./field-role";
import { useInsertUserMutation } from "./mutations";

interface Props {
  user?: UserData;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  role?: Role;
}
export default function FormAddEditUser({
  user,
  role,
  open,
  onOpenChange,
}: Props) {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    values: {
      id: user?.id || "",
      email: user?.email || "",
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      role: role || user?.role!,
      password: "",
      username: user?.username || "",
      name: user?.name || "",
    },
  });
  const { mutate, isPending } = useInsertUserMutation();
  function submitForm(input: SignUpSchema) {
    mutate(input, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" className=" overflow-y-auto scroll-smooth ">
        <div className="max-w-7xl space-y-6 mx-auto w-full  ">
          <SheetHeader className="w-full">
            <SheetTitle className="text-center">
              {user ? "Update" : "Create a new"} committee Member
            </SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <div className="space-y-6 p-3 w-fit mx-auto md:w-xl">
              {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-3 gap-3 ">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel required>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="e.g., someone@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FieldRole form={form} />
              </div>

              <FormFooter className="mt-6">
                <LoadingButton
                  type="button"
                  loading={isPending}
                  size={"lg"}
                  onClick={() => form.handleSubmit(submitForm)()}
                >
                  {user ? "Update member info" : "Create member"}
                </LoadingButton>
              </FormFooter>
            </div>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
