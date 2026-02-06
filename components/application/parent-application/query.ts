import { FeeAssessmentType } from "@/lib/generated/prisma/enums";
import { LandApplicationData, ParentApplicationData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  getAllLandApplications,
  getAllParentApplications,
  getAllParentApplicationsByFeeAssessmentType,
} from "./actions";

export function useLandApplicationsQuery(initialData: LandApplicationData[]) {
  return useQuery({
    queryKey: ["land-applications"],
    queryFn: getAllLandApplications,
    initialData,
    refetchOnWindowFocus: false,
  });
}

export function useParentApplicationsQuery(
  initialData: ParentApplicationData[],
) {
  return useQuery({
    queryKey: ["parent-applications"],
    queryFn: getAllParentApplications,
    initialData,
    refetchOnWindowFocus: false,
  });
}

export function useFeeAssessmentParentApplicationsQuery(
  initialData: ParentApplicationData[],
  feeAssessmentType: FeeAssessmentType,
) {
  return useQuery({
    queryKey: ["parent-applications", "fee-assessment", feeAssessmentType],
    queryFn: async () =>
      getAllParentApplicationsByFeeAssessmentType(feeAssessmentType),
    initialData,
    refetchOnWindowFocus: false,
  });
}
