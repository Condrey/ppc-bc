import { getUserById } from "@/components/application/users/action";
import Container from "@/components/container";
import { roles } from "@/lib/enums";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import UserPageClient from "../../../../../components/application/users/user-page-client";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const userId = decodeURIComponent(id);
  const user = await getUserById(userId);
  if (!user)
    return {
      title: "User Not Found",
      description: "The item you are looking for does not exist.",
    };
  const { title: userTitle } = roles[user.role];

  return {
    title: `${user.name} - User`,
    description: `Viewing details for ${userTitle} ${user.name} in the managements section.`,
  };
}

export default async function Page({ params }: Props) {
  const { id: paramsId } = await params;
  const userId = decodeURIComponent(paramsId);
  const user = await getUserById(userId);
  if (!user) return notFound();

  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/admin" },
        { title: "All Users", href: "/admin/users" },
        { title: user.name },
      ]}
    >
      <UserPageClient initialData={user} />
    </Container>
  );
}
