import { getUserByUsername } from "@/components/application/users/action";
import Container from "@/components/container";
import { roles } from "@/lib/enums";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import UserPageClient from "../../../../components/application/users/user-page-client";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { username: _username } = await params;
  const username = decodeURIComponent(_username);
  const user = await getUserByUsername(username);
  if (!user) {
    return {
      title: "User not found",
      description:
        " Check the url and try again. Otherwise this resource has been deleted or moved to another location.",
    };
  }
  const { name, email, avatarUrl, role } = user;
  const _userRole = roles[role].title;
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `${name} - ${_userRole}`,
    description: `Information concerning ${name} (@${username}) the ${_userRole} with email ${email}`,
    openGraph: {
      images: [avatarUrl!, ...previousImages],
    },
  };
}

export default async function page({ params }: Props) {
  const { username: _username } = await params;
  const username = decodeURIComponent(_username);
  const user = await getUserByUsername(username);
  if (!user) {
    return notFound();
  }

  return (
    <Container
      breadcrumbs={[{ title: "Home", href: "/admin" }, { title: user.name }]}
      ITEMS_TO_DISPLAY={2}
    >
      <UserPageClient initialData={user} />
    </Container>
  );
}
