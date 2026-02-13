import { getAllCommitteeMeetings } from "@/components/application/meetings/action";
import Container from "@/components/container";
import { TypographyH2 } from "@/components/headings";
import { Button } from "@/components/ui/button";
import { committees } from "@/lib/enums";
import { Committee } from "@/lib/generated/prisma/enums";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";
import { PageClient } from "./page-client";

interface Props {
  params: Promise<{ committeeType: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { committeeType: decodedCommitteeType } = await params;
  const committeeType = decodeURIComponent(decodedCommitteeType) as Committee;
  const meetings = await getAllCommitteeMeetings(committeeType);

  const { title } = committees[committeeType];
  return {
    title: `${title} meetings`,
    description: `Showing ${meetings.length} meeting(s) for ${title}`,
  };
};

export default async function Page({ params }: Props) {
  const { committeeType: decodedCommitteeType } = await params;
  const committeeType = decodeURIComponent(decodedCommitteeType) as Committee;
  const meetings = await getAllCommitteeMeetings(committeeType);
  const { title } = committees[committeeType];

  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/admin" },
        { title: `${title} meetings` },
      ]}
      ITEMS_TO_DISPLAY={2}
    >
      <TypographyH2
        text={`${title} Meetings`}
        className="flex items-center flex-wrap justify-between"
      >
        <Button className="ms-auto max-w-fit w-full" variant={"secondary"}>
          <PlusIcon className="inline" /> new meeting
        </Button>
      </TypographyH2>
      <PageClient meetings={meetings} committeeType={committeeType} />
    </Container>
  );
}
