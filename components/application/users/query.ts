"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllCommitteeMembers } from "./action";

export function useCommitteeMemberQuery() {
  return useQuery({
    queryKey: ["committee-members"],
    queryFn: getAllCommitteeMembers,
  });
}
