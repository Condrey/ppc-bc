"use client";

import { MeetingData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getMeetingById } from "./action";

export function useMeetingQuery(initialData: MeetingData) {
  const id = initialData.id;
  return useQuery({
    queryKey: ["meeting", id],
    queryFn: async () => getMeetingById(id),
    initialData,
  });
}
