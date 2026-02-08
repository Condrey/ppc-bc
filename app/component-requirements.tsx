import { TypographyH2 } from "@/components/headings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const items: {
  title: string;
  description: string;
  children?: React.ReactNode;
}[] = [
  {
    title: "Requirements for Land Change of Use",
    description: ` Land change of use applications must state the proposed land
                use, provide location and parcel details, and show how access,
                utilities, and surrounding uses are addressed.`,
    children: undefined,
  },
  {
    title: "Requirements for Building applications",
    description: `  Building applications vary by class and complexity. Requirements
                typically cover architectural plans, structural details, and
                compliance with safety standards.`,
  },
  {
    title: "Classes of buildings",
    description: `Requirements are organized by building class to ensure the right
            level of review. Residential, commercial, institutional, and
            industrial projects have distinct documentation and inspection
            expectations.`,
  },
];
export default function ComponentRequirements() {
  return (
    <div className="space-y-6 bg-radial dark:to-transparent to-muted dark:from-muted py-12 px-3">
      <section id="requirements" className="max-w-5xl space-y-8 mx-auto">
        <TypographyH2 text="Requirements" className="uppercase" />
        <p className="max-w-prose text-center mx-auto">
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
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
