import {
  ComprehensiveUserAppealData,
  ComprehensiveUserApplicationData,
  ComprehensiveUserResubmissionData,
} from "@/lib/types";
import MyAppeals from "./my-appeals";
import MyApplications from "./my-applications";
import MyResubmissions from "./my-resubmissions";

interface Props {
  appeals: ComprehensiveUserAppealData[];
  resubmissions: ComprehensiveUserResubmissionData[];
  applications: ComprehensiveUserApplicationData[];
}
export default function SectionApplications({
  appeals,
  resubmissions,
  applications,
}: Props) {
  return (
    <div className="space-y-4 divide-dotted divide-warning *:pb-4 divide-y-2">
      <MyApplications applications={applications} />
      <MyAppeals appeals={appeals} />
      <MyResubmissions resubmissions={resubmissions} />
    </div>
  );
}
