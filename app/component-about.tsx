import { TypographyH1 } from "@/components/headings";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Building2Icon, LandPlotIcon, LucideIcon } from "lucide-react";

const items: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "The Physical Planning Committee (PPC)",
    description: `The PPC oversees land use planning and evaluates change of use
              applications against national and local planning regulations. It
              applies acts such as the PPA 2010 to ensure orderly development
              and compliance with approved land use policies.`,
    icon: LandPlotIcon,
  },
  {
    title: "The Building Control (BC)",
    description: `The BC committee ensures building safety, structural compliance,
              and adherence to construction standards. It coordinates building
              inspections and confirms that approved plans are followed on-site.`,
    icon: Building2Icon,
  },
];
export default function ComponentAbout() {
  return (
    <section
      id="about"
      className="space-y-6 bg-secondary flex flex-col lg:flex-col-reverse"
    >
      <TypographyH1 text="About the Committees " className="lg:uppercase" />
      <div className="grid gap-3 md:grid-cols-2 ">
        {items.map(({ description, icon: Icon, title }, index) => (
          <Empty key={index}>
            <EmptyMedia variant={"default"}>
              <Icon className="size-32 fill-primary/20" strokeWidth={0.5} />
            </EmptyMedia>
            <EmptyHeader className="">
              <EmptyTitle>{title}</EmptyTitle>
              <EmptyDescription className="text-justify ">
                {description}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>{}</EmptyContent>
          </Empty>
        ))}
      </div>
    </section>
  );
}
