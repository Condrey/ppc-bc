"use client";

import { useSession } from "@/app/(auth)/session-provider";
import UserAvatar from "@/app/(auth)/user-avatar";
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
import { MailIcon } from "lucide-react";
import { useState } from "react";
import { FormUpdatePassword } from "../form-update-password";

export function SectionUserDetails({ user }: { user: UserData }) {
  const {
    avatarUrl,
    email,
    id,
    name,
    role: _role,
    username,
    ppcMembership: _ppcMembership,
  } = user;
  const { user: sessionUser } = useSession();
  const isOwner = sessionUser?.id === user.id;
  const [imageUrl, setImageUrl] = useState(avatarUrl);
  const role = roles[_role].title;
  const ppcMembership = ppcMemberships[_ppcMembership].title;
  const { startUpload, isUploading, uploadProgress } = useProfileImageUpload();
  return (
    <Card className="max-w-sm">
      <CardHeader className="items-center justify-center">
        {isOwner ? (
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
        ) : (
          <UserAvatar
            avatarUrl={imageUrl}
            size={160}
            className={cn(isUploading && "animate-pulse")}
          />
        )}
        {isOwner && (
          <CardDescription>
            {isUploading && (
              <span className="inline mr-2 font-bold">{uploadProgress}%</span>
            )}
            <span>{`Click on image to change profile <4MBs`}</span>
          </CardDescription>
        )}
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
          This user is the{" "}
          <strong className="text-success text-shadow-2xs">{role}</strong> and{" "}
          <strong className="inline ">{ppcMembership}</strong> of the Physical
          Planning Committee.
        </p>
      </CardFooter>
      {isOwner && (
        <CardFooter className="border-t">
          <Accordion
            type="single"
            collapsible
            defaultValue="password"
            className="w-full border"
          >
            <AccordionItem value="password">
              <AccordionTrigger className="bg-muted px-2">
                ChangePassword
              </AccordionTrigger>
              <AccordionContent className="px-2">
                <FormUpdatePassword userId={id} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardFooter>
      )}
    </Card>
  );
}
