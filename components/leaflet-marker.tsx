"use client";

import { cn } from "@/lib/utils";
import L from "leaflet";
import { LucideIcon, MapPinIcon } from "lucide-react";
import { useMemo } from "react";
import { renderToString } from "react-dom/server";
import { Marker } from "react-leaflet";

interface Props {
  icon?: LucideIcon;
  iconLabel?: string | number | undefined;
  className?: string;
  position: L.LatLngExpression;
  children?: React.ReactNode;
  animate?: boolean;
}

export function LeafletMarker({
  position,
  icon: Icon,
  iconLabel,
  children,
  className,
  animate = true,
}: Props) {
  const iconHtml = useMemo(
    () =>
      renderToString(
        <div
          className={cn(
            "flex items-center justify-center size-20 relative",
            className,
          )}
        >
          <div className="flex flex-col items-center justify-center size-full">
            {Icon ? (
              <Icon
                className={cn(
                  "size-10 fill-destructive/50 text-destructive",
                  animate && "animate-bounce",
                )}
                strokeWidth={0.5}
              />
            ) : (
              <MapPinIcon
                className={cn(
                  "size-10 fill-destructive/50 text-destructive",
                  animate && "animate-bounce",
                )}
                strokeWidth={0.5}
              />
            )}
            {iconLabel && (
              <h2 className="text-lg md:text-xl font-semibold font-mono underline">
                {String(iconLabel)}
              </h2>
            )}
          </div>

          <div
            className={cn(
              "size-20 rounded-full absolute",
              animate && "animate-ping bg-destructive/50 border-destructive",
            )}
          />
        </div>,
      ),
    [Icon, iconLabel, className, animate],
  );

  const icon = useMemo(
    () =>
      L.divIcon({
        html: iconHtml,
        className: "",
        iconSize: [80, 80], // match your actual size!
        iconAnchor: [40, 40], // center it properly
      }),
    [iconHtml],
  );

  return (
    <Marker position={position} icon={icon}>
      {children}
    </Marker>
  );
}
