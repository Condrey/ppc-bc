import { TypographyH2 } from "@/components/headings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
const items: {
  title: string;
  description: string;
  children?: React.ReactNode;
}[] = [
  {
    title: "Requirements for Land Application",
    description: ` Land change of use applications must state the proposed land
                use, provide location and parcel details, and show how access,
                utilities, and surrounding uses are addressed.`,
    children: undefined,
  },
  {
    title: "Requirements for Building application",
    description: `  Building applications vary by class and complexity. Requirements
                typically cover architectural plans, structural details, and
                compliance with safety standards.`,
    children: <BuildingApplicationRequirements />,
  },
  {
    title: "Know your Class of building",
    description: `Requirements are organized by building class to ensure the right
            level of review. Residential, commercial, institutional, and
            industrial projects have distinct documentation and inspection
            expectations.`,
  },
];
export default function ComponentRequirements() {
  return (
    <div className="space-y-6 bg-radial  dark:to-transparent to-muted  dark:from-muted py-12 px-3">
      <section id="requirements" className="max-w-5xl space-y-8 mx-auto">
        <TypographyH2 text="Application Requirements" className="uppercase" />
        <p className="max-w-prose text-center text-pretty mx-auto">
          Different constructions require different requirements and
          documentation. The guidance below helps applicants prepare correctly
          for both land and building applications.
        </p>
        <Accordion
          type="single"
          className="border rounded-xl p-4 bg-card"
          collapsible
        >
          {items.map(({ description, title, children }, index) => (
            <AccordionItem key={index} value={title}>
              <AccordionTrigger className="text-lg ">
                {index + 1}. {title}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-start max-w-prose">{description}</p>
                {children}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}

function BuildingApplicationRequirements() {
  return (
    <div>
      <div>
        <ItemGroup className="grid md:grid-cols-2 gap-4">
          <Item variant={"muted"}>
            <ItemContent className="justify-start flex flex-col items-start">
              <ItemTitle>Physical Planning Committee (PPC)</ItemTitle>
              <ItemDescription className="text-start">
                This committee reviews land use applications and ensures they
                comply with physical planning regulations.
              </ItemDescription>
              <ul className="list-decimal py-4 space-y-1.5 list-inside text-start">
                <li>PPA Form 1</li>
                <li>Introductory Letter from LC1</li>
                <li>Proof of Land ownership</li>
                <li>Site Plan</li>
                <li>
                  Boundary Opening Report for titled land/ preliminary boundary
                  opening report for untitled land
                </li>
                <li>Photocopy of National ID</li>
              </ul>
            </ItemContent>
          </Item>
          <Item variant={"muted"}>
            <ItemContent>
              <ItemTitle>Building Control (BC)</ItemTitle>
              <ItemDescription>
                This committee verifies that the proposed building design meets
                safety and construction standards, including structural
                integrity, fire safety, and accessibility.
              </ItemDescription>
              <ul></ul>
            </ItemContent>
          </Item>
        </ItemGroup>
      </div>
    </div>
  );
}
