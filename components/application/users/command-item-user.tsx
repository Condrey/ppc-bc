"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { cn, getColorsFromText, getNameInitials } from "@/lib/utils";
import { CheckIcon, MailIcon } from "lucide-react";
import React from "react";

interface Props {
  user: UserData;
  avatarSize?: string;
  className?: string;
  variant?: "default" | "muted" | "outline";
  isChecked: boolean;
  title?: string;
}
export default function CommandItemUser({
  user: { avatarUrl, email, name, role, username },
  avatarSize,
  isChecked,
  className,
  variant,
  title,
}: Props) {
  const { color2: BG_GRADIENT } = getColorsFromText(name);
  const { title: userRole } = roles[role];
  return (
    <Item
      variant={variant || "default"}
      className={cn("p-0 w-full flex-nowrap max-w-xs", className)}
    >
      <ItemMedia className="shrink ">
        <Avatar
          style={
            {
              "--avatar-size": avatarSize,
              "--bg-gradient": BG_GRADIENT,
            } as React.CSSProperties
          }
          className="size-(--avatar-size) shrink"
        >
          <AvatarImage src={avatarUrl!} alt="user profile" />
          <AvatarFallback className="bg-radial to-(--bg-gradient) from-(--bg-gradient)/50 text-(--bg-gradient) text-xl font-bold">
            {getNameInitials(name)}
          </AvatarFallback>
        </Avatar>
      </ItemMedia>
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
