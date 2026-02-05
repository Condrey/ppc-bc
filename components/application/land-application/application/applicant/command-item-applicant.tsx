"use client";

import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Applicant } from "@/lib/generated/prisma/client";
import { ApplicantData } from "@/lib/types";
import { cn, getColorsFromText, getNameInitials } from "@/lib/utils";
import { CheckIcon, MapPinIcon } from "lucide-react";
import React from "react";

interface Props {
  applicant: ApplicantData;
  avatarSize?: string;
  className?: string;
  variant?: "default" | "muted" | "outline";
  isChecked: boolean;
  title?: string;
}
export default function CommandItemApplicant({
  applicant: {
    address,
    name,
    contact,
    user: { avatarUrl },
  },
  avatarSize,
  isChecked,
  className,
  variant,
  title,
}: Props) {
  const { color2: BG_GRADIENT } = getColorsFromText(name);
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
        <ItemTitle className="line-clamp-1 text-xs">{contact}</ItemTitle>
        <div className="flex gap-0.5  items-center">
          <MapPinIcon className="fill-muted-foreground size-3.5 text-muted" />
          <TipTapViewer
            content={address}
            className="text-muted-foreground line-clamp-2 text-xs leading-normal font-normal text-balance"
          />
        </div>
      </ItemContent>
      <ItemActions>
        <CheckIcon
          className={cn("ml-auto", isChecked ? "opacity-100" : "opacity-0")}
        />
      </ItemActions>
    </Item>
  );
}

export function ChosenApplicantCommandItem({
  applicant,
}: {
  applicant: Applicant | undefined;
}) {
  if (!applicant) return null;
  const { name, contact } = applicant;
  return (
    <div className="flex max-w-md justify-between gap-2 items-center">
      <p className="line-clamp-1 text-ellipsis">{name}</p> -{" "}
      <span className="text-muted-foreground">{contact}</span>
    </div>
  );
}
