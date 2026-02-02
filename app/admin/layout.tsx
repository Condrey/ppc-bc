import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { validateRequest } from "../(auth)/auth";
import SessionProvider from "../(auth)/session-provider";
import { AppSidebar } from "./app-sidebar";
import Footer from "./footer";
import TopAppBar from "./top-app-bar";

export const iframeHeight = "800px";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, user } = await validateRequest();
  if (!!user && !user.isVerified) {
    console.log(
      "redirecting to user verification because they are not yet verified",
      { user },
    );
    redirect(`/user-verification/${user.id}`);
  }

  return (
    <SessionProvider value={{ session, user }}>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col ">
          <header className="sticky top-0 z-50 h-(--header-height) flex items-center w-full  bg-accent text-accent-foreground   dark:border-b">
            <TopAppBar className="w-full max-w-9xl  py-2 mx-auto  px-3 " />
          </header>
          <div className="flex  flex-1 size-full ">
            <AppSidebar />
            <SidebarInset>
              <div className=" mx-auto h-full pt-2 overflow-hidden flex flex-col  w-full">
                <main className=" flex-1 w-full   overflow-y-auto scroll-auto flex flex-col gap-4 ">
                  {children}
                  <footer className="w-full">
                    <Footer className="bg-black/80 dark:bg-white/20 *:px-4 w-full  text-background dark:text-foreground " />
                  </footer>
                </main>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </SessionProvider>
  );
}
