"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn, siteConfig, webName } from "@/lib/utils";

interface TopAppBarProps {
  className?: string;
}

export default function TopAppBar({ className }: TopAppBarProps) {
  return (
    <header className={cn("", className)}>
      <SidebarTrigger
        className="md:hidden"
        size={"xl"}
        variant={"destructive"}
      />
      <p className="uppercase ms-2 inline">
        <span className="md:hidden">{webName}</span>
        <span className="hidden md:block">{siteConfig.name}</span>
      </p>
    </header>
  );
}
