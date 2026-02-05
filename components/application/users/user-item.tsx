import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { UserData } from "@/lib/types";
import { cn, getColorsFromText, getNameInitials } from "@/lib/utils";
import { Avatar } from "@radix-ui/react-avatar";
import { CheckIcon } from "lucide-react";

interface Props {
  user: UserData;
  className?: string;
  variant: "default" | "outline" | "muted" | null | undefined;
  avatarSize?: string;
  isChecked: boolean;
}
export default function UserItem({
  user,
  className,
  variant,
  isChecked,
  avatarSize = "45px",
}: Props) {
  const { avatarUrl, email, name: fullName, role, username } = user;
  const { color2: BG_GRADIENT } = getColorsFromText(fullName);
  return (
    <Item
      variant={variant || "default"}
      className={cn("p-0 w-full max-w-md", className)}
    >
      <ItemMedia>
        <Avatar
          style={
            {
              "--avatar-size": avatarSize,
              "--bg-gradient": BG_GRADIENT,
            } as React.CSSProperties
          }
          className="size-(--avatar-size)"
        >
          <AvatarImage src={avatarUrl!} alt="user profile" />
          <AvatarFallback className="bg-radial to-(--bg-gradient) from-(--bg-gradient)/50 text-(--bg-gradient) text-xl font-bold">
            {getNameInitials(fullName)}
          </AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="line-clamp-1">{fullName}</ItemTitle>
        <ItemDescription className="inline-block line-clamp-1">
          {username || email}
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
