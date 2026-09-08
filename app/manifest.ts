import type { MetadataRoute } from "next";
import { NAME } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${NAME} - Developer, Musician & Teacher`,
    short_name: NAME,
    description:
      "Portfolio of Juliette, a curious and creative developer who loves building things.",
    start_url: "/",
    display: "standalone",
    background_color: "#130f0c",
    theme_color: "#e8c44a",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/juliette.png",
        sizes: "598x1141",
        type: "image/png",
      },
    ],
  };
}