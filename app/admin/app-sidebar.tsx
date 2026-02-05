"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { NavLink, NavLinkGroup, navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronRight, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height)  h-[calc(100svh-var(--header-height))]! not-only:bg-primary"
      collapsible="icon"
      {...props}
    >
      {/* <SidebarHeader className=" p-0">
        <SidebarMenu className="">
          <SidebarMenuItem>
            <SidebarMenuButton className="flex flex-col  w-full  h-fit  data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground items-center justify-center rounded-lg bg-sidebar text-sidebar-foreground">
              <div className="flex flex-col items-center aspect-square size-full max-h-40 ">
                <Image
                  src={"/logo.png"}
                  alt="logo"
                  width={150}
                  height={150}
                  className="bg-cover size-full"
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader> */}
      <SidebarContent className="px-0">
        <SidebarGroup className="px-0">
          <SidebarGroupLabel>Navigation Menu </SidebarGroupLabel>
          <SidebarMenu>
            {navLinks.map((item, index) => (
              <ParentMenuItem key={item.href} item={item} index={index} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function ParentMenuItem({
  item,
  index,
}: {
  item: NavLinkGroup;
  index: number;
}) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const ItemIcon = item.icon!;
  const isActive = item.children.some((i) => pathname.startsWith(i.href));
  const noDropDown = index === 0 || !item.children.length;
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const url = noDropDown
    ? getNavigationLinkWithPathnameWithoutUpdate(item.href)
    : "#";
  const iconClassName = " [&svg]:size-5.5 fill-muted text-muted-foreground ";
  return (
    <>
      <Collapsible
        key={item.title}
        defaultOpen={index === 1 || isActive}
        asChild
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isActive}
              size={"lg"}
              className=""
              onClick={() => startTransition(() => {})}
              asChild
            >
              <Link href={url}>
                {item.icon && (
                  <>
                    {isPending ? (
                      <Spinner className={iconClassName} />
                    ) : (
                      <ItemIcon className={iconClassName} />
                    )}
                  </>
                )}
                <span
                  className={cn("line-clamp-1 text-ellipsis wrap-break-word")}
                >
                  {item.title}
                </span>
                <ChevronRight
                  className={cn(
                    "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90",
                    noDropDown && "hidden",
                  )}
                />
              </Link>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          {item.children?.length ? (
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.children.map((i) => (
                  <MenuItem parentLink={item.href} item={i} key={i.href} />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          ) : null}
        </SidebarMenuItem>
      </Collapsible>
    </>
  );
}

function MenuItem({ item, parentLink }: { item: NavLink; parentLink: string }) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const isActive = pathname.startsWith(item.href) && pathname !== "/";

  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const url = getNavigationLinkWithPathnameWithoutUpdate(item.href);
  return (
    <SidebarMenuSubItem key={item.title}>
      <SidebarMenuSubButton
        title={item.description}
        onClick={() => startTransition(() => {})}
        asChild
        isActive={isActive}
      >
        <Link href={url} className="h-fit py-1 flex gap-2">
          {isPending && <Loader2Icon className="animate-spin size-4" />}
          {item.title}
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
