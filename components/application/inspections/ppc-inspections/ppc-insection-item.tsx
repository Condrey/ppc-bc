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
import {
  ApplicationType,
  FeeAssessmentType,
} from "@/lib/generated/prisma/enums";
import { ParentApplicationData } from "@/lib/types";
import { getApplicationNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { CheckIcon, HistoryIcon, MapPinIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

type Props = {
  item: ParentApplicationData;
  navigateTo?: string;
};

export default function PpcInspectionItem({ item, navigateTo }: Props) {
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
      feeAssessments,
      applicant: {
        name,
        user: { avatarUrl },
      },
    },
    landUse: { landUseType, otherLandUseType },
    natureOfInterest,
  } = item;
  const { title: _landUse } = landUseTypes[landUseType];
  const { title: landInterest } = naturesOfInterestInLand[natureOfInterest];
  const usePurpose = landUseType === "OTHERS" ? otherLandUseType : _landUse;
  const { title: applicationType } = applicationTypes[type];
  const isLandApplication = type === ApplicationType.LAND;
  const fees = feeAssessments.filter((f) =>
    isLandApplication
      ? f.assessmentType === FeeAssessmentType.LAND_APPLICATION
      : f.assessmentType === FeeAssessmentType.BUILDING_APPLICATION,
  );
  const location = `${cell ? `${cell} cell, ` : ""}${village ? `${village} village, ` : ""}${parish ? `${parish} parish, ` : ""}${subCounty ? `${subCounty}, ` : ""} ${district}`;
  const inspected = status !== "SUBMITTED";
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
            <Badge
              variant={inspected ? "success" : "destructive"}
              className="font-bold"
            >
              {inspected ? (
                <span>
                  <CheckIcon className="inline size-4" /> Inspected
                </span>
              ) : (
                <span>
                  <XIcon className="size-4 inline" />
                  Inspected
                </span>
              )}
            </Badge>
          )}
        </ItemMedia>
      </ItemHeader>

      <ItemContent>
        <div>{`${landInterest} for ${usePurpose}`} purpose</div>

        <p className="line-clamp-1  text-muted-foreground">
          <MapPinIcon className="inline size-5 mr-1 fill-muted text-muted-foreground" />
          {location}
        </p>
      </ItemContent>
      <ItemFooter>
        <p className="line-clamp-1">
          <span className="italic text-muted-foreground">For</span> {name}
        </p>
        <span className="block flex-none">
          <HistoryIcon className="inline size-4 mr-1" />
          {formatDate(createdAt, "PP")}
        </span>
      </ItemFooter>
    </>
  );
};
