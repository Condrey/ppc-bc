"use client";

import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Props {
  className?: string;
  placeholder: string;
}
export default function SearchContainer({ className, placeholder }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className={cn("relative flex flex-1 shrink-0", className)}>
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>
      <Input
        className="peer block w-full py-2.25 pl-10"
        placeholder={placeholder}
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
