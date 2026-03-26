import { ApplicationData } from "@/lib/types";

import CommandItemApplicant from "@/components/application/parent-application/application/applicant/command-item-applicant";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  applicationStatuses,
  applicationTypes,
  feesAssessmentTypes,
} from "@/lib/enums";
import { Address } from "@/lib/generated/prisma/client";
import { ApplicationType } from "@/lib/generated/prisma/enums";
import {
  cn,
  formatCurrency,
  getApplicationNumber,
  getLocation,
} from "@/lib/utils";
import { formatDate } from "date-fns";
import { CheckIcon, HistoryIcon, MapPinIcon } from "lucide-react";

interface Props {
  application: ApplicationData;
}
export default function SectionHeader({ application }: Props) {
  const {
    applicant,
    feeAssessments,
    applicationNo,
    createdAt,
    type,
    year,
    status,
    landApplication,
    buildingApplication,
  } = application;
  const { title: applicationType } = applicationTypes[type];
  const { title: applicationStatus } = applicationStatuses[status];

  return (
    <div className="flex-col sm:flex-row flex flex-wrap *:flex-1 gap-3">
      <Item variant={"muted"}>
        <ItemContent>
          <ItemTitle className="font-bold">{applicationType}</ItemTitle>
          <ItemTitle>
            {getApplicationNumber(applicationNo, year, type)}
          </ItemTitle>
          <ItemDescription>
            <HistoryIcon className="size-4 inline mr-1" />
            submitted {formatDate(createdAt, "PPp")}
          </ItemDescription>
          <ItemActions className="hidden md:block">
            <Badge variant={"outline"}>Status: {applicationStatus}</Badge>
          </ItemActions>
        </ItemContent>
      </Item>
      <CommandItemApplicant
        applicant={applicant}
        isChecked={false}
        variant="muted"
        className="p-3 w-full  max-w-none sm:max-w-xs"
        avatarSize="60px"
        title="APPLICANT"
      />
      {feeAssessments.map(
        ({ id, amountAssessed, currency, assessmentType, payments }) => {
          const { title } = feesAssessmentTypes[assessmentType];
          const amountPaid = payments.reduce(
            (amount, total) => amount + total.amountPaid,
            0,
          );
          const balance = amountAssessed - amountPaid;
          const hasBalance = balance > 0;
          return (
            <Item key={id} variant={"muted"}>
              <ItemContent>
                <ItemTitle className="font-bold">{title}</ItemTitle>
                <ItemTitle className="font-mono oldstyle-nums slashed-zero">
                  {formatCurrency(amountAssessed, currency, true)}
                </ItemTitle>
                <ItemDescription className="font-mono oldstyle-nums slashed-zero">
                  Paid: {formatCurrency(amountPaid, currency, true)}
                </ItemDescription>
                <ItemDescription
                  className={cn(
                    hasBalance &&
                      " font-mono oldstyle-nums slashed-zero text-destructive",
                  )}
                >
                  {hasBalance ? (
                    `Bal: ${formatCurrency(balance, currency, true)}`
                  ) : (
                    <span className="text-success font-semibold">
                      <CheckIcon className="inline" />
                      Fully paid
                    </span>
                  )}
                </ItemDescription>
              </ItemContent>
            </Item>
          );
        },
      )}
      <AddressDetails
        address={
          type === ApplicationType.LAND
            ? landApplication?.address
            : buildingApplication?.address
        }
      />
    </div>
  );
}

function AddressDetails({ address }: { address: Address | undefined }) {
  if (!address) return null;
  const { location } = address;
  return (
    <Item variant={"muted"} className="max-w-none md:max-w-sm">
      <ItemContent>
        <ItemDescription>Precise location, {location}</ItemDescription>
        <p className="inline *:inline items-center">
          <MapPinIcon className="inline fill-muted-foreground text-muted" />{" "}
          <span className="inline-flex">{getLocation(address)}</span>
        </p>
      </ItemContent>
    </Item>
  );
}
