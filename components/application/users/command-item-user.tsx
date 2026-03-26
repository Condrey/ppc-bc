"use client";

import ApplicantAvatar from "@/components/applicant-avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { roles } from "@/lib/enums";
import { UserData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckIcon, MailIcon } from "lucide-react";

interface Props {
  user: UserData;
  avatarSize?: string;
  className?: string;
  variant?: "default" | "muted" | "outline";
  isChecked: boolean;
  title?: string;
}
export default function CommandItemUser({
  user: { avatarUrl, email, name, role },
  avatarSize,
  isChecked,
  className,
  variant,
  title,
}: Props) {
  const { title: userRole } = roles[role];
  return (
    <Item
      variant={variant || "default"}
      className={cn("p-0 w-full  max-w-xs", className)}
    >
      <ItemContent>
        <ItemMedia className="shrink ">
          <ApplicantAvatar
            avatarUrl={avatarUrl}
            name={name}
            avatarSize={avatarSize}
          />
        </ItemMedia>
      </ItemContent>
      <ItemContent className="gap-0">
        {title && <ItemTitle className="font-bold">{title}</ItemTitle>}
        <ItemTitle className="line-clamp-1">{name}</ItemTitle>
        <div className="flex gap-0.5 text-muted-foreground  items-center">
          <MailIcon className="" />
          <span>{email}</span>
        </div>
        <ItemDescription className="line-clamp-1 text-xs">
          {userRole}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <CheckIcon
          className={cn("ml-auto", isChecked ? "opacity-100" : "opacity-0")}
        />
      </ItemActions>
    </Item>
  );
}

export function ChosenUserCommandItem({
  user,
}: {
  user: UserData | undefined;
}) {
  if (!user) return null;
  const { name, role } = user;
  const { title: userRole } = roles[role];

  return (
    <div className="flex max-w-md justify-between gap-2 items-center">
      <p className="line-clamp-1 text-ellipsis">{name}</p> -{" "}
      <span className="text-muted-foreground">{userRole}</span>
    </div>
  );
}
