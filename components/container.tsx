import { BreadcrumbItem as BreadcrumbType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { ResponsiveBreadcrumb } from "./responsive-breadcrumb";

interface Props extends React.ComponentProps<"div"> {
  breadcrumbs?: BreadcrumbType[];
  ITEMS_TO_DISPLAY?: number;
}

export default function Container({
  breadcrumbs,
  ITEMS_TO_DISPLAY,
  className,
  children,
  ...props
}: Props) {
  return (
    <div className="size-full ">
      {!!breadcrumbs && (
        <Suspense>
          <ResponsiveBreadcrumb
            items={breadcrumbs}
            ITEMS_TO_DISPLAY={ITEMS_TO_DISPLAY}
            className="sticky top-0 bg-background "
          />
        </Suspense>
      )}
      <div
        className={cn(
          "max-w-9xl w-full px-3 py-12 space-y-6 mx-auto",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
