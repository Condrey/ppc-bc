"use client";

import Link from "next/link";
import * as React from "react";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { useIsMobile } from "@/hooks/use-mobile";
import { BreadcrumbItem as BreadcrumbType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { Spinner } from "./ui/spinner";

interface Props extends React.ComponentProps<"div"> {
  items: BreadcrumbType[];
  ITEMS_TO_DISPLAY?: number;
}

export function ResponsiveBreadcrumb({
  items,
  ITEMS_TO_DISPLAY = 3,
  className,
  ...props
}: Props) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = !useIsMobile();
  const [isPending, startTransition] = React.useTransition();
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();

  return (
    <Breadcrumb
      className={cn("bg-muted py-2 px-3 rounded-md", className)}
      {...props}
    >
      <BreadcrumbList>
        <SidebarTrigger className="flex-inline size-8 mr-10   " />
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => startTransition(() => {})} asChild>
            <Link
              href={getNavigationLinkWithPathnameWithoutUpdate(
                items[0].href ?? "/",
              )}
              className="flex items-center gap-2"
            >
              {isPending && <Spinner />}
              {items[0].title}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {items.length > ITEMS_TO_DISPLAY ? (
          <>
            <BreadcrumbItem>
              {isDesktop ? (
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger
                    className="flex items-center gap-1"
                    aria-label="Toggle menu"
                    asChild
                  >
                    <Button variant={"ghost"} size={"icon-sm"}>
                      <span className="sr-only">View hidden links</span>
                      <BreadcrumbEllipsis className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {items.slice(1, -2).map((item, index) => (
                      <CustomDropDownMenuItem key={index} item={item} />
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger aria-label="Toggle Menu" asChild>
                    <Button variant={"ghost"} size={"icon-sm"}>
                      <span className="sr-only">View hidden links</span>
                      <BreadcrumbEllipsis className="h-4 w-4" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-left">
                      <DrawerTitle>Navigate to</DrawerTitle>
                      <DrawerDescription>
                        Select a page to navigate to.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="grid gap-1 px-4">
                      {items.slice(1, -2).map((item, index) => (
                        <CustomDrawerItem key={index} item={item} />
                      ))}
                    </div>
                    <DrawerFooter className="pt-4">
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ) : null}
        {items.slice(-ITEMS_TO_DISPLAY + 1).map((item, index) => (
          <CustomBreadcrumbItem key={index} item={item} />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function CustomDropDownMenuItem({ item }: { item: BreadcrumbType }) {
  const [isPending, startTransition] = React.useTransition();
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const url = getNavigationLinkWithPathnameWithoutUpdate(item.href || "#");
  return (
    <DropdownMenuItem onClick={() => startTransition(() => {})}>
      {isPending && <Spinner />}
      <Link href={url}>{item.title}</Link>
    </DropdownMenuItem>
  );
}

function CustomDrawerItem({ item }: { item: BreadcrumbType }) {
  const [isPending, startTransition] = React.useTransition();
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const url = getNavigationLinkWithPathnameWithoutUpdate(item.href || "#");

  return (
    <Link
      href={url}
      onClick={() => startTransition(() => {})}
      className="py-1 text-sm flex items-center"
    >
      {isPending && <Spinner />}
      {item.title}
    </Link>
  );
}

function CustomBreadcrumbItem({ item }: { item: BreadcrumbType }) {
  const [isPending, startTransition] = React.useTransition();
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const url = getNavigationLinkWithPathnameWithoutUpdate(item.href ?? "/");

  return (
    <BreadcrumbItem onClick={() => startTransition(() => {})}>
      {isPending && <Spinner />}
      {item.href ? (
        <>
          <BreadcrumbLink asChild className="max-w-20 truncate md:max-w-none">
            <Link href={url}>{item.title}</Link>
          </BreadcrumbLink>
          <ChevronRightIcon className="size-3.5" />
        </>
      ) : (
        <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
          {item.title}
        </BreadcrumbPage>
      )}
    </BreadcrumbItem>
  );
}
