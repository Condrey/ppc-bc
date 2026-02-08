import { TypographyH1 } from "@/components/headings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function ComponentHero() {
  return (
    <div className="space-y-6">
      <TypographyH1
        text="Land Applications and Building Applications"
        className="uppercase"
      />
      <p className="mx-auto max-w-prose text-muted-foreground">
        An initiative of Lira City Council to accelerate land change of use
        applications and related permits, including development permits, and
        building permits.
      </p>
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle className="uppercase">
            Starting a building in the city?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Do you want to construct within the city and do not know the
            procedure? We provide a clear, guided process for applicants and a
            structured workflow for administrators.
          </p>
        </CardContent>
        <CardFooter className="space-x-3 flex-wrap justify-center">
          <CardAction className="">
            <Button asChild size="lg">
              <Link href="/signup">Start Application</Link>
            </Button>
          </CardAction>
          <CardAction>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Sign In</Link>
            </Button>
          </CardAction>
          <CardAction>
            <Button asChild size="lg" variant="secondary">
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}
