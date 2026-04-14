"use client";

import UserAvatar from "@/app/(auth)/user-avatar";
import { getUserById } from "@/components/application/users/action";
import { TypographyH1 } from "@/components/headings";
import ErrorContainer from "@/components/query-container/error-container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonAddSingleAttachment } from "@/components/uploadthing/button-add-attachment";
import { ppcMemberships, roles } from "@/lib/enums";
import { UserData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { MailIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { FormUpdatePassword } from "./form-update-password";

export default function UserPageClient({
  initialData,
}: {
  initialData: UserData;
}) {
  const id = initialData.id;
  const query = useQuery({
    queryKey: ["user", id],
    queryFn: async () => getUserById(id),
    initialData,
  });
  const { data, status } = query;

  if (!data) return notFound();
  const { name } = data;
  return (
    <>
      <div className="flex gap-3">
        <TypographyH1 text={name} className="line-clamp-2" />
      </div>
      {status === "error" ? (
        <ErrorContainer
          errorMessage="An error occurred while fetching user"
          query={query}
        />
      ) : (
        <User user={data} />
      )}
    </>
  );
}

function User({ user }: { user: UserData }) {
  const {
    avatarUrl,
    email,
    id,
    name,
    role: _role,
    username,
    ppcMembership: _ppcMembership,
  } = user;
  const role = roles[_role].title;
  const ppcMembership = ppcMemberships[_ppcMembership].title;
  return (
    <>
      <Card className="max-w-md">
        <CardHeader className="items-center justify-center">
          <UserAvatar avatarUrl={avatarUrl} size={100} />
          <ButtonAddSingleAttachment
            disabled={false}
            onFilesSelected={() => {}}
          />
        </CardHeader>
        <CardContent>
          <CardTitle>{name}</CardTitle>
          <CardTitle>
            <MailIcon className="inline mr-2" />
            {email}
          </CardTitle>
          <CardDescription>@{username}</CardDescription>
        </CardContent>
        <CardFooter>
          <p className="inline *:inline">
            This user is the {role} and{" "}
            <strong className="inline ">{ppcMembership}</strong> of the Physical
            Planning Committee.
          </p>
        </CardFooter>
        <CardFooter className="border-t">
          <Accordion type="single" collapsible className="w-full border">
            <AccordionItem value="password">
              <AccordionTrigger className="bg-success/20 px-2">
                ChangePassword
              </AccordionTrigger>
              <AccordionContent className="px-2">
                <FormUpdatePassword userId={id} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardFooter>
      </Card>
    </>
  );
}
