import { getAllRoleBasedUsers } from "@/components/application/users/action";
import { ListOfRoleBasedUsers } from "@/components/application/users/list-of-role-based-users";
import Container from "@/components/container";
import { TypographyH1 } from "@/components/headings";
import { roles } from "@/lib/enums";
import { Role } from "@/lib/generated/prisma/enums";
import { Metadata } from "next";

interface Props {
  params: Promise<{ role: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { role: encodedRole } = await params;
  const role = decodeURIComponent(encodedRole);
  const { title } = roles[(role as Role) || Role.APPLICANT];
  return {
    title: `All ${title} members`,
  };
};

export default async function Page({ params }: Props) {
  const { role: encodedRole } = await params;
  const role = decodeURIComponent(encodedRole) as Role;
  const { title } = roles[role || Role.APPLICANT];
  const users = await getAllRoleBasedUsers(role);

  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/" },
        { title: "Users", href: "/admin/users" },
        { title: title + "s", href: `/admin/users/${role}` },
      ]}
      ITEMS_TO_DISPLAY={2}
    >
      <TypographyH1 text={`All ${title}s`} className="uppercase" />
      <ListOfRoleBasedUsers role={role} initialData={users} />
    </Container>
  );
}
