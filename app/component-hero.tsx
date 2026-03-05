import { TypographyH1 } from "@/components/headings";
import { Button } from "@/components/ui/button";
import { CardAction, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export default function ComponentHero() {
  return (
    <div className="space-y-12 flex flex-col items-center  max-w-5xl  mx-auto w-full flex-1 z-30 isolate bg-blend-color justify-center ">
      <TypographyH1
        text="Land & Building Applications"
        className="uppercase max-w-xl  text-shadow-2xs text-6xl font-black"
      />
      <p className="mx-auto max-w-prose text-lg text-pretty tracking-wide text-center text-shadow-2xs ">
        An initiative of Lira City Council to accelerate land applications and building
        applications, related permits including development permits, and
        building permits.
      </p>

      <CardFooter className="space-x-3 flex-wrap justify-center">
        <CardAction className="">
          <Button asChild size="lg">
            <Link href="/signup">Apply Now</Link>
          </Button>
        </CardAction>
        <CardAction>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Log In</Link>
          </Button>
        </CardAction>
        <CardAction>
          <Button asChild size="lg" variant="secondary">
            <Link href="/admin">Admin Dashboard</Link>
          </Button>
        </CardAction>
      </CardFooter>
    </div>
  );
}
