"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn, siteConfig, webName } from "@/lib/utils";
import Image from "next/image";

interface TopAppBarProps {
  className?: string;
}

export default function TopAppBar({ className }: TopAppBarProps) {
  return (
    <header className={cn("flex items-center", className)}>
      <Image src={"/logo.png"} alt="logo" height={50} width={50} />
      <p className="uppercase ms-2 text-xl md:text-2xl w-full line-clamp-1  items-center inline ">
        <span className="md:hidden">{webName}</span>
        <span className="hidden md:inline">{siteConfig.name}</span>
      </p>
      <SidebarTrigger
        className="md:hidden"
        size={"xl"}
        variant={"destructive"}
      />
    </header>
  );
}
