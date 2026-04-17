import {
  ComprehensiveUserFeeAssessmentData,
  ComprehensiveUserPaymentData,
} from "@/lib/types";

interface Props {
  payments: ComprehensiveUserPaymentData[];
  feeAssessments: ComprehensiveUserFeeAssessmentData[];
}
export default function SectionPayments({ payments, feeAssessments }: Props) {
  return <div>SectionPayments</div>;
}
