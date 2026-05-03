import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { privilegeLinks } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { validateRequest } from "../(auth)/auth";

export const metadata: Metadata = {
  title: "Not Found",
  description:
    "The resource you are looking for does not exist or it has been moved to another location.",
};
export default function Page() {
  const validation = validateRequest();

  return (
    <div className="h-dvh flex items-center justify-center">
      <Empty className="">
        <EmptyMedia>
          <Image src={"/logo.png"} height={200} width={200} alt="Logo" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle className="text-2xl font-bold tracking-tight">
            <span className="text-warning font-black">404</span> - Resource Not
            found
          </EmptyTitle>
          <EmptyDescription>
            The resource you are looking for does not exist or it has been moved
            to another location. Please consider visiting other pages
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="grid grid-cols-3 gap-3 max-w-3xl">
          <Suspense fallback={<LoadingSkeleton />}>
            {validation.then(({ user }) => {
              const { navLinks } = privilegeLinks[user?.role || "APPLICANT"];
              return (
                <>
                  {navLinks.map(({ title, href, icon: Icon }) => (
                    <Link
                      key={title}
                      href={href}
                      className={buttonVariants({
                        variant: "secondary",
                        className: "flex justify-start",
                      })}
                    >
                      {Icon && <Icon />} {title}
                    </Link>
                  ))}
                </>
              );
            })}
          </Suspense>
        </EmptyContent>
      </Empty>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 max-w-3xl w-full ">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="flex items-center gap-3 animate-pulse">
          <Skeleton className="w-9 h-9" />
          <Skeleton className="h-9 w-full flex-1" />
        </div>
      ))}
    </div>
  );
}
