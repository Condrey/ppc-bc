import { getAllParentApplicationsByFeeAssessmentType } from "@/components/application/parent-application/actions";
import { ListOfTypeBasedFeesAssessments } from "@/components/application/parent-application/fees-assessment/list-of-type-based-fees-assessments";
import Container from "@/components/container";
import { TypographyH1 } from "@/components/headings";
import { feesAssessmentTypes } from "@/lib/enums";
import { FeeAssessmentType } from "@/lib/generated/prisma/enums";
import { Metadata } from "next";

interface Props {
  params: Promise<{ feeType: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { feeType: encodedRole } = await params;
  const feeAssessmentType = decodeURIComponent(encodedRole);
  const { title } =
    feesAssessmentTypes[
      (feeAssessmentType as FeeAssessmentType) || FeeAssessmentType.INSPECTION
    ];
  return {
    title: `All ${title} fee assessments`,
  };
};

export default async function Page({ params }: Props) {
  const { feeType: encodedRole } = await params;
  const feeAssessmentType = decodeURIComponent(
    encodedRole,
  ) as FeeAssessmentType;
  const { title } =
    feesAssessmentTypes[feeAssessmentType || FeeAssessmentType.INSPECTION];
  const parentApplications =
    await getAllParentApplicationsByFeeAssessmentType(feeAssessmentType);

  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/" },
        { title: "Fees assessments", href: "/admin/fees-assessments/" },
        {
          title: title + "s",
          href: `/admin/fees-assessments/${feeAssessmentType}`,
        },
      ]}
      ITEMS_TO_DISPLAY={2}
    >
      <TypographyH1
        text={`All ${title} fee assessments`}
        className="uppercase"
      />
      <ListOfTypeBasedFeesAssessments
        feeAssessmentType={feeAssessmentType}
        initialData={parentApplications}
      />
    </Container>
  );
}
