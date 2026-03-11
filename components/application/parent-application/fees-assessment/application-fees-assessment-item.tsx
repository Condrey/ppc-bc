import ApplicantAvatar from "@/components/applicant-avatar";
import {
  Item,
  ItemContent,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { feesAssessmentTypes, roles } from "@/lib/enums";
import { FeeAssessmentData } from "@/lib/types";
import { cn, formatCurrency, getApplicationNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { CheckIcon, CoinsIcon, Edit2Icon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import ButtonAddEditFeeAssessment from "./button-add-edit-fee-assessment";
import ButtonAddEditPayment from "./payments/button-add-edit-payment";

type Props = {
  item: FeeAssessmentData;
  navigateTo?: string;
};
export default function ApplicationFeesAssessmentItem({
  item,
  navigateTo,
}: Props) {
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
    id,
    application,
    assessmentType: _assessmentType,
    amountAssessed,
    currency,
    payments: allPayments,
    assessedAt,
    assessedBy: { name, role, avatarUrl },
  } = item;
  const { applicationNo, year, type } = application;
  const applicationNumber = getApplicationNumber(applicationNo, year, type);
  const { title } = roles[role];
  const payments = allPayments.reduce(
    (amount, total) => amount + total.amountPaid,
    0,
  );
  const balance = amountAssessed - payments;
  const { title: assessmentType, icon: Icon } =
    feesAssessmentTypes[_assessmentType];

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
            <ItemTitle>
              <div>
                <Icon className="inline mr-2 size-5" />
                {assessmentType + " fee"}
              </div>
            </ItemTitle>
            <div className="text-muted-foreground">
              <div>{formatDate(assessedAt, "PPp")}</div>
              <div className="text-xs text-muted-foreground">
                {name} - {title}
              </div>
            </div>{" "}
          </div>
        </div>
        <ItemMedia className="text-muted-foreground ">
          {isPending && navigateTo ? <Spinner /> : <CoinsIcon />}
        </ItemMedia>
      </ItemHeader>

      <ItemContent>
        <p>{applicationNumber}</p>
        <div className="flex justify-between gap-2 items-center flex-wrap">
          <div>
            <span className="text-muted-foreground font-semibold">Paid: </span>
            <span
              className={cn(
                "slashed-zero font-mono",
                payments <= 0 ? "font-medium" : "text-success",
              )}
            >
              {payments <= 0
                ? "Nothing"
                : formatCurrency(payments, currency, true)}
            </span>
          </div>

          {balance <= 0 ? (
            <div className="text-success font-bold">
              <CheckIcon className="inline" />
              Fully paid
            </div>
          ) : (
            <>
              <div className="border-b border-dotted border-foreground flex-1" />
              <div>
                <span className="text-muted-foreground font-semibold">
                  bal:{" "}
                </span>
                <span className="text-destructive slashed-zero font-mono">
                  {formatCurrency(balance, currency, true)}
                </span>
              </div>
            </>
          )}
        </div>
      </ItemContent>
      <ItemFooter>
        <ButtonAddEditFeeAssessment
          application={application}
          assessmentType={_assessmentType}
          feeAssessment={item}
          size={"sm"}
          variant={"outline"}
        >
          <Edit2Icon /> Edit fee
        </ButtonAddEditFeeAssessment>
        <ButtonAddEditPayment feeAssessmentId={id} size={"sm"}>
          <PlusIcon /> Pay fee
        </ButtonAddEditPayment>
      </ItemFooter>
    </>
  );
};
