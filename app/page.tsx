import type { Metadata } from "next";
import { NAME, SHORT_DESCRIPTION } from "@/lib/constants";
import { HomeClient } from "./home-client";

export const metadata: Metadata = {
  title: {
    absolute: `${NAME} - Developer, Musician & Teacher`,
  },
  description: SHORT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${NAME} - Developer, Musician & Teacher`,
    description: SHORT_DESCRIPTION,
    url: "https://pancake.wtf",
    siteName: NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${NAME} - Developer, Musician & Teacher`,
    description: SHORT_DESCRIPTION,
    creator: "@Cinnamo44817432",
  },
};

export default function Home() {
  return <HomeClient />;
}