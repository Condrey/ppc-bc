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
import {
  applicationTypes,
  landUseTypes,
  naturesOfInterestInLand,
} from "@/lib/enums";
import { ParentApplicationData } from "@/lib/types";
import { getApplicationNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { HistoryIcon, LandPlotIcon, MapPinIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

type Props = {
  item: ParentApplicationData;
  navigateTo?: string;
};

export default function ParcelItem({ item, navigateTo }: Props) {
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
          <Content item={item} isPending={isPending} />
        </Link>
      ) : (
        <Content item={item} isPending={isPending} />
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
    landUse: { landUseType, otherLandUseType },
    natureOfInterest,
    parcel,
  } = item;
  const { title: applicationType } = applicationTypes[type];
  const location = `${cell ? `${cell} cell, ` : ""}${village ? `${village} village, ` : ""}${parish ? `${parish} parish, ` : ""}${subCounty ? `${subCounty}, ` : ""} ${district}`;
  const isLAndApplication = type === "LAND";
  const { title: usePurpose } = landUseTypes[landUseType];
  const { title: landInterest } = naturesOfInterestInLand[natureOfInterest];

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
            <LandPlotIcon className="text-muted-foreground" />
          )}
        </ItemMedia>
      </ItemHeader>

      <ItemContent>
        <p className="text-pretty hyphens-auto text-sm ">
          {isLAndApplication ? (
            <>Application for {landInterest} certificate</>
          ) : (
            <>{`Development permission for ${landUseType === "OTHERS" ? otherLandUseType : usePurpose} purpose on ${landInterest} land`}</>
          )}
        </p>
        <p className="line-clamp-1  text-muted-foreground">
          <MapPinIcon className="inline size-5 mr-1 fill-muted text-muted-foreground" />
          {location}
        </p>
        <p className="line-clamp-1">
          <span className="italic text-muted-foreground">For</span> {name}
        </p>
      </ItemContent>
      <ItemFooter>
        {!parcel ? (
          <Badge variant={"destructive"}>
            <XIcon className="inline size-4" /> Parcel
          </Badge>
        ) : (
          <>
            {parcel.parcelNumber ? (
              <Badge variant={"success"}>Parcel ${parcel.parcelNumber}</Badge>
            ) : (
              <Badge variant={"destructive"} className="opacity-50">
                <XIcon className="inline size-4" /> Parcel Number
              </Badge>
            )}
          </>
        )}
        <span className="block flex-none">
          <HistoryIcon className="inline size-4 mr-1" />
          {formatDate(createdAt, "PP")}
        </span>
      </ItemFooter>
    </>
  );
};
