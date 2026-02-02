import { clsx, type ClassValue } from "clsx";
import { formatDuration, intervalToDuration } from "date-fns";
import { twMerge } from "tailwind-merge";
import { applicationTypes } from "./enums";
import { ApplicationType } from "./generated/prisma/enums";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const webName = `Physical Planning and Building Control`;
export const organization = "Lira City Council";
export const siteConfig = {
  name: webName,
  url: process.env.NEXT_PUBLIC_BASE_URL,
  logo: "/logo.png",
  defaultCoverImage: "/web-app-manifest-512x512.png",
  description: `Physical Planning and Building Control Management tool for Lira City Council. To manage Land and BUilding Applications, generate reports and audit professional, technical and council meetings.`,
};

export const getNameInitials = (name: string) => {
  const initials = name
    .split(" ")
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join("");
  return initials.toUpperCase();
};

// should produce values like 1000 as 1k
export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function formatPercentage(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "standard",
    maximumSignificantDigits: 3,
    minimumSignificantDigits: 2,
    style: "percent",
  }).format(n);
}

export function formatCurrency(
  amount: number,
  currency?: string,
  shouldNotCompact?: boolean,
): string {
  return Intl.NumberFormat("en-US", {
    notation: shouldNotCompact ? "standard" : "compact",
    minimumSignificantDigits: 2,
    compactDisplay: "long",
    style: "currency",
    currency: currency || "Ugx",
  }).format(amount);
}

export function getColorsFromText(text: string) {
  // deterministic hex based on name length
  const len = Math.max(1, text.length);
  const hash = (len * 2654435761) >>> 0; // spread bits deterministically
  const color_one = (hash & 0xffffff).toString(16).padStart(6, "0");
  const color_two = (((hash >>> 8) | (hash << 24)) & 0xffffff)
    .toString(16)
    .padStart(6, "0");

  const color1 = `#${color_one}`;
  const color2 = `#${color_two}`;
  const linear_gradient = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;

  return { color1, color2, linear_gradient };
}

export function slugify(input: string | undefined): string {
  return input
    ? input
        .toLowerCase() // Convert to lowercase
        .trim() // Remove leading and trailing whitespace
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "") // Replace spaces with hyphens
        .replace(/-+/g, "") // Remove multiple consecutive hyphens
    : "";
}

export const calculateDuration = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date | null | undefined;
}) =>
  formatDuration(
    intervalToDuration({
      start: startDate,
      end: endDate ?? new Date(),
    }),
  );

export const getApplicationNumber = (
  appNo: number,
  year: number,
  appType: ApplicationType,
) => {
  const { regIdentifier } = applicationTypes[appType];
  return (
    "LCC/" + regIdentifier + "/" + String(appNo).padStart(3, "0") + "/" + year
  );
};
