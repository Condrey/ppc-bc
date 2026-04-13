"use client";

import { getUserById } from "@/components/application/users/action";
import { TypographyH1 } from "@/components/headings";
import ErrorContainer from "@/components/query-container/error-container";
import { UserData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";

export default function UserPageClient({
  initialData,
}: {
  initialData: UserData;
}) {
  const id = initialData.id;
  const query = useQuery({
    queryKey: ["user", id],
    queryFn: async () => getUserById(id),
    initialData,
  });
  const { data, status } = query;

  if (!data) return notFound();
  const { name } = data;
  return (
    <>
      <div className="flex gap-3">
        <TypographyH1 text={name} className="line-clamp-2" />
      </div>
      {status === "error" ? (
        <ErrorContainer
          errorMessage="An error occurred while fetching user"
          query={query}
        />
      ) : (
        <div></div>
      )}
    </>
  );
}
