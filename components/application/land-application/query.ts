import { LandApplicationData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getAllLandApplications } from "./actions";

export function useLandApplicationsQuery(initialData: LandApplicationData[]) {
  return useQuery({
    queryKey: ["land-applications"],
    queryFn: getAllLandApplications,
    initialData,
    refetchOnWindowFocus: false,
  });
}
