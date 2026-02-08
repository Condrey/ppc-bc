import { TypographyH1 } from "@/components/headings";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import Link from "next/link";

const items = [
  {
    title: "The Acts",
    description:
      "The Physical Planning Act (PPA 2010) guides land use planning,change of use applications, and development control.",
    href: "",
    button: "Download PPA 2010",
  },
  {
    title: "Building Control Regulations",
    description:
      " Establishes safety, structural, and inspection standards for building projects within the city.",
    href: "",
    button: "Download Regulations",
  },
];
export default function ComponentActs() {
  return (
    <section
      id="acts"
      className="space-y-6 bg-linear-to-bl from-cyan-400 dark:from-muted dark:to-transparent to-fuchsia-400"
    >
      <TypographyH1 text="The Guiding documents" className="lg:uppercase" />
      <p className="max-w-prose text-justify hyphens-auto mx-auto">
        These acts define the legal foundation for land use planning and
        building control. Applicants are encouraged to read them to understand
        their responsibilities and the approval process.
      </p>
      <div className="space-y-4">
        {items.map(({ button, description, href, title }, index) => (
          <Item
            key={index}
            variant={"outline"}
            className="bg-card/80 dark:bg-card/20 dark:backdrop-blur-2xl backdrop-blur-3xl"
          >
            <ItemContent className="space-y-2">
              <ItemTitle className="text-xl font-medium">{title}</ItemTitle>
              <ItemDescription className="text-foreground text-start opacity-80 hyphens-auto max-w-md">
                {description}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button asChild>
                <Link href={href}>{button}</Link>
              </Button>
            </ItemActions>
          </Item>
        ))}
      </div>
    </section>
  );
}
