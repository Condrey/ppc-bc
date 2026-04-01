import { siteConfig } from "@/lib/utils";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const { description, name, short_name } = siteConfig;
  return {
    name,
    short_name,
    description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
