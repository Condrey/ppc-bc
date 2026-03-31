import Container from "@/components/container";
import { getDashboardInfo } from "@/components/dashboard/action";
import DashboardComponents from "@/components/dashboard/dashboard-components";
import { InstallPromptIOS } from "@/components/pwa/install-prompt-ios";
import { PushNotificationManager } from "@/components/pwa/push-notification-manager";

export default async function Page() {
  const dashboardItem = await getDashboardInfo();
  return (
    <Container breadcrumbs={[{ title: "Dashboard" }]} ITEMS_TO_DISPLAY={1}>
      <PushNotificationManager />
      <InstallPromptIOS />
      <DashboardComponents initialData={dashboardItem} />
    </Container>
  );
}
