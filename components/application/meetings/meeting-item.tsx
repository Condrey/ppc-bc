import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { committees, meetingStatuses } from "@/lib/enums";
import { MeetingData } from "@/lib/types";
import { getMeetingNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { HistoryIcon, MapPinIcon, Users2Icon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

type Props = {
  item: MeetingData;
  navigateTo?: string;
};

export default function MeetingItem({ item, navigateTo }: Props) {
  const [isPending, startTransition] = useTransition();
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const url = navigateTo
    ? getNavigationLinkWithPathnameWithoutUpdate(navigateTo)
    : "#";

  return (
    <>
      <Item
        size={"sm"}
        variant={"muted"}
        onClick={() => startTransition(() => {})}
        asChild={!!navigateTo}
      >
        {navigateTo ? (
          <Link href={url}>
            <Content
              item={item}
              navigateTo={navigateTo}
              isPending={isPending}
            />
          </Link>
        ) : (
          <Content item={item} navigateTo={navigateTo} isPending={isPending} />
        )}
      </Item>
    </>
  );
}

const Content = ({
  item,
  navigateTo,
  isPending,
}: Props & { isPending: boolean }) => {
  const {
    meetingNo,
    title,
    status,
    committee,
    applications,
    venue,
    happeningOn,
    postponedOn,
  } = item;
  const isPostponed = !!postponedOn;
  const date = isPostponed ? postponedOn : happeningOn;
  const meetingNumber = getMeetingNumber(meetingNo, date);
  const { title: meetingStatus, variant } = meetingStatuses[status];
  const { title: meetingCommittee } = committees[committee];
  const numberOfApplications = applications.length;
  return (
    <>
      <ItemHeader>
        <div>
          <ItemTitle className="text-success">{meetingNumber}</ItemTitle>
          <ItemDescription>{meetingCommittee} meeting</ItemDescription>
        </div>
        <ItemMedia>
          {isPending && navigateTo ? (
            <Spinner />
          ) : (
            <Badge variant={variant}>{meetingStatus}</Badge>
          )}
        </ItemMedia>
      </ItemHeader>

      <ItemContent>
        <p>
          <Users2Icon className="inline size-5 mr-1   " />
          {title}
        </p>
        <p className="line-clamp-1  text-muted-foreground">
          <MapPinIcon className="inline size-5 mr-1 text-muted-foreground " />
          {venue}
        </p>
      </ItemContent>
      <ItemFooter>
        <p className="line-clamp-1 text-muted-foreground">
          {numberOfApplications === 0
            ? "No applications available"
            : `${numberOfApplications} application${numberOfApplications === 1 ? "" : "s"}`}
        </p>
        <span className="block flex-none">
          <HistoryIcon className="inline size-4 mr-1" />
          {formatDate(date, "PPPp")}{" "}
          {isPostponed && <strong className="text-warning">-P</strong>}
        </span>
      </ItemFooter>
    </>
  );
};
