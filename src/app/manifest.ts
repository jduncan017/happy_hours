import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HappyHourHunt Denver",
    short_name: "HappyHourHunt",
    description:
      "Every Denver happy hour, sorted by time and neighborhood. Verified weekly.",
    start_url: "/search",
    display: "standalone",
    background_color: "#fafaf9", // stone-50
    theme_color: "#ff8f28", // po1
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["food", "lifestyle", "travel"],
  };
}
