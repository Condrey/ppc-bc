import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not Found",
  description:
    "The resource you are looking for does not exist or it has been moved to another location.",
};
export default function Page() {
  return (
    <div className="h-dvh flex items-center justify-center">
      <Empty>
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
        <EmptyContent className="flex flex-row gap-2 justify-center">
          {[
            { title: "Home", href: "/" },
            { title: "Login", href: "/login" },
          ].map(({ title, href }) => (
            <Link
              key={title}
              href={href}
              className={buttonVariants({ variant: "secondary" })}
            >
              {title}
            </Link>
          ))}
        </EmptyContent>
      </Empty>
    </div>
  );
}
