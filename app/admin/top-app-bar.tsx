"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn, siteConfig, webName } from "@/lib/utils";

interface TopAppBarProps {
  className?: string;
}

export default function TopAppBar({ className }: TopAppBarProps) {
  return (
    <header className={cn("flex items-center", className)}>
      <SidebarTrigger
        className="md:hidden"
        size={"xl"}
        variant={"destructive"}
      />
      <p className="uppercase ms-2 text-xl md:text-2xl w-full *:line-clamp-1  items-center inline ">
        <span className="md:hidden">{webName}</span>
        <span className="hidden md:inline">{siteConfig.name}</span>
      </p>
    </header>
  );
}
