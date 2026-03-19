import Container from "@/components/container";

export default async function Page() {
  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/admin" },
        { title: "Registration" },
      ]}
      ITEMS_TO_DISPLAY={2}
    >
      registration
    </Container>
  );
}
