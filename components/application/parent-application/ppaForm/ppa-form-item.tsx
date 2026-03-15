import ApplicantAvatar from "@/components/applicant-avatar";
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
import { applicationStatuses, applicationTypes } from "@/lib/enums";
import { ParentApplicationData } from "@/lib/types";
import { getApplicationNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { HistoryIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

type Props = {
  item: ParentApplicationData;
  navigateTo?: string;
};

export default function PpaFormItem({ item, navigateTo }: Props) {
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
    address: { cell, district, village, subCounty, parish },
    application: {
      applicationNo,
      year,
      type,
      status,
      createdAt,
      applicant: {
        name,
        user: { avatarUrl },
      },
    },
  } = item;
  const { title: applicationType } = applicationTypes[type];
  const { title: applicationStatus, variant } = applicationStatuses[status];
  const location = `${cell ? `${cell} cell, ` : ""}${village ? `${village} village, ` : ""}${parish ? `${parish} parish, ` : ""}${subCounty ? `${subCounty}, ` : ""} ${district}`;

  const applicationNumber = getApplicationNumber(applicationNo, year, type);

  return (
    <>
      <ItemHeader>
        <div className="flex  shrink-0 flex-row gap-2">
          <ApplicantAvatar
            avatarUrl={avatarUrl}
            name={name}
            avatarSize={"40px"}
          />
          <div>
            <ItemTitle>{applicationType}</ItemTitle>
            <ItemDescription>{applicationNumber}</ItemDescription>
          </div>
        </div>
        <ItemMedia>
          {isPending && navigateTo ? (
            <Spinner />
          ) : (
            <Badge variant={variant}>{applicationStatus}</Badge>
          )}
        </ItemMedia>
      </ItemHeader>

      <ItemContent>
        <p className="line-clamp-1  text-muted-foreground">
          <MapPinIcon className="inline size-5 mr-1 fill-muted text-muted-foreground" />
          {location}
        </p>
      </ItemContent>
      <ItemFooter>
        <p className="line-clamp-1">
          <span className="italic text-muted-foreground">by</span> {name}
        </p>
        <span className="block flex-none">
          <HistoryIcon className="inline size-4 mr-1" />
          {formatDate(createdAt, "PP")}
        </span>
      </ItemFooter>
    </>
  );
};
