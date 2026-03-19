import { getAllCommitteeMembers } from "@/components/application/users/action";
import { ListOfUsers } from "@/components/application/users/list-of-users";
import Container from "@/components/container";
import { TypographyH1 } from "@/components/headings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All members",
};

export default async function Page() {
  const users = await getAllCommitteeMembers();

  return (
    <Container
      breadcrumbs={[{ title: "Home", href: "/" }, { title: "Users" }]}
      ITEMS_TO_DISPLAY={2}
    >
      <TypographyH1 text="All Committee Members" className="uppercase" />
      <ListOfUsers initialData={users} />
    </Container>
  );
}
