import ApplicantAvatar from "@/components/applicant-avatar";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { memberships, roles } from "@/lib/enums";
import { UserData } from "@/lib/types";
import Link from "next/link";
import { useTransition } from "react";

interface Props {
  item: UserData;
  navigateTo?: string;
}
export default function UserCardItem({ item, navigateTo }: Props) {
  const [isPending, startTransition] = useTransition();
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const url = navigateTo
    ? getNavigationLinkWithPathnameWithoutUpdate(navigateTo)
    : "#";

  return (
    <Item
      size={"sm"}
      variant={"muted"}
      onClick={() => startTransition(() => {})}
      asChild={!!navigateTo}
    >
      {navigateTo ? (
        <Link href={url}>
          <Content item={item} navigateTo={navigateTo} isPending={isPending} />
        </Link>
      ) : (
        <Content item={item} navigateTo={navigateTo} isPending={isPending} />
      )}
    </Item>
  );
}

const Content = ({
  item,
  navigateTo,
  isPending,
}: Props & { isPending: boolean }) => {
  const {
    avatarUrl,
    email,
    name: fullName,
    role,
    username,
    ppcMembership,
  } = item;
  const { title: userRole } = roles[role];
  const { title: userMembership } = memberships[ppcMembership];

  return (
    <>
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
        <p>
          {userRole}{" "}
          <span className="text-muted-foreground">({userMembership})</span>
        </p>
      </ItemContent>
      <ItemMedia>{isPending && navigateTo && <Spinner />}</ItemMedia>
    </>
  );
};
