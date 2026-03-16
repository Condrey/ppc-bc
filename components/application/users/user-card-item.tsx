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

interface Props {
  item: UserData;
}
export default function UserCardItem({ item }: Props) {
  const { avatarUrl, email, name: fullName, role, username } = item;
  const { title: userRole } = roles[role];
  return (
    <Item variant={"muted"} className={cn(" w-full ")}>
      <ItemMedia>
        <ApplicantAvatar
          avatarUrl={avatarUrl}
          name={fullName}
          avatarSize="65px"
        />
      </ItemMedia>
      <ItemContent className="space-y-0.5 gap-0">
        <ItemTitle className="line-clamp-1">{fullName}</ItemTitle>
        <p className="inline-block line-clamp-1">
          {email}- <span className="text-muted-foreground">@{username}</span>
        </p>
        <ItemDescription>{userRole}</ItemDescription>
      </ItemContent>
      <ItemActions></ItemActions>
    </Item>
  );
}
