import { siteConfig } from "@/lib/utils";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const { description, name } = siteConfig;
  return {
    name: name,
    short_name: "NextPWA",
    description: description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    prefer_related_applications: true,
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
