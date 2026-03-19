import Container from "@/components/container";
import { getDashboardInfo } from "@/components/dashboard/action";
import DashboardComponents from "@/components/dashboard/dashboard-components";

export default async function Page() {
  const dashboardItem = await getDashboardInfo();
  return (
    <Container breadcrumbs={[{ title: "Dashboard" }]} ITEMS_TO_DISPLAY={1}>
      <DashboardComponents initialData={dashboardItem} />
    </Container>
  );
}
