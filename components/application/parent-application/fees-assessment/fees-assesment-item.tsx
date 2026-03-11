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
import { applicationTypes, naturesOfInterestInLand } from "@/lib/enums";
import { ParentApplicationData } from "@/lib/types";
import { formatCurrency, getApplicationNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { CheckIcon, CoinsIcon, DotIcon, HistoryIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

type Props = {
  item: ParentApplicationData;
  navigateTo?: string;
};

export default function FeesAssessmentItem({ item, navigateTo }: Props) {
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
      createdAt,
      applicant: {
        name,
        user: { avatarUrl },
      },
      feeAssessments,
    },
    natureOfInterest,
  } = item;

  const { title: applicationType } = applicationTypes[type];
  const location = `${cell ? `${cell} cell, ` : ""}${village ? `${village} village, ` : ""}${parish ? `${parish} parish, ` : ""}${subCounty ? `${subCounty}, ` : ""} ${district}`;
  const { title: interest } = naturesOfInterestInLand[natureOfInterest];
  const applicationNumber = getApplicationNumber(applicationNo, year, type);
  const allAssessments = feeAssessments.map(
    ({ payments: allPayments, amountAssessed }) => {
      const payments = allPayments.reduce(
        (amount, total) => amount + total.amountPaid,
        0,
      );
      const balance = amountAssessed - payments;
      return { payments, balance };
    },
  );
  const allPayments = allAssessments.reduce(
    (amount, total) => amount + total.payments,
    0,
  );
  const allBalances = allAssessments.reduce(
    (amount, total) => amount + total.balance,
    0,
  );
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
        <ItemMedia className="text-muted-foreground ">
          {isPending && navigateTo ? <Spinner /> : <CoinsIcon />}
        </ItemMedia>
      </ItemHeader>

      <ItemContent>
        <p className="line-clamp-1 font-semibold">{name}</p>
        <p className="line-clamp-1  ">
          <span>{interest},</span>{" "}
          <span className="text-muted-foreground">{location}</span>
        </p>
      </ItemContent>
      <ItemFooter>
        {allBalances === 0 ? (
          <Badge variant={"success"} className="">
            <CheckIcon />
            All payments cleared
          </Badge>
        ) : (
          <p>
            <span className="italic text-muted-foreground">Paid</span>{" "}
            {allPayments === 0
              ? "Nothing"
              : formatCurrency(allPayments, "UGX", true)}
            <DotIcon className="inline" />{" "}
            <Badge variant={"destructive"}>
              <span className="italic font-sans">Bal</span>{" "}
              {allBalances === 0
                ? "Nothing"
                : formatCurrency(allBalances, "UGX", true)}
            </Badge>
          </p>
        )}
        <span className="block flex-none">
          <HistoryIcon className="inline size-4 mr-1" />
          {formatDate(createdAt, "PP")}
        </span>
      </ItemFooter>
    </>
  );
};
