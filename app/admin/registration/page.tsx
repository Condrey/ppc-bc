import Container from "@/components/container";

export default async function Page() {
  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/admin" },
        { title: "Registration", href: "/admin/registration" },
      ]}
      ITEMS_TO_DISPLAY={2}
    >
      registration
    </Container>
  );
}
