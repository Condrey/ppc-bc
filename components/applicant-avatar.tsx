import { getColorsFromText, getNameInitials } from "@/lib/utils";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Props {
  name: string;
  avatarSize?: string;
  className?: string;
  avatarUrl: string | null | undefined;
}

export default function ApplicantAvatar({
  avatarSize,
  name,
  avatarUrl,
}: Props) {
  const { color2: BG_GRADIENT } = getColorsFromText(name);

  return (
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
  );
}
