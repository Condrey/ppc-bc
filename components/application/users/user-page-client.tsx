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
import { useProfileImageUpload } from "@/hooks/use-media-upload";
import { ppcMemberships, roles } from "@/lib/enums";
import { UserData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { MailIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { useState } from "react";
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

  const [imageUrl, setImageUrl] = useState(avatarUrl);
  const role = roles[_role].title;
  const ppcMembership = ppcMemberships[_ppcMembership].title;
  const { startUpload, isUploading, uploadProgress } = useProfileImageUpload();
  return (
    <>
      <Card className="max-w-md">
        <CardHeader className="items-center justify-center">
          <ButtonAddSingleAttachment
            disabled={false}
            variant={"ghost"}
            className="rounded-full h-full max-h-fit p-0 px-0"
            onFilesSelected={(files) => {
              const file = files?.[0];
              const url = URL.createObjectURL(file);

              setImageUrl(url);
              if (!file) return;
              startUpload(files);
            }}
          >
            <UserAvatar
              avatarUrl={imageUrl}
              size={160}
              className={cn(isUploading && "animate-pulse")}
            />
          </ButtonAddSingleAttachment>
          <CardDescription>
            {isUploading && (
              <span className="inline mr-2 font-bold">{uploadProgress}%</span>
            )}
            <span>{`Click on image to change profile <4MBs`}</span>
          </CardDescription>
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
