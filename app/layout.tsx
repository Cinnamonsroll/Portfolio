import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  NAME,
  DESCRIPTION,
  SHORT_DESCRIPTION,
  GITHUB,
  LINKEDIN,
  X,
  KOFI,
  WCA,
} from "@/lib/constants";
import "./globals.css";
import { VantaProvider } from "@/components/providers/vanta";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://pancake.wtf";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${NAME} - Developer, Musician & Teacher`,
    template: `%s - ${NAME}`,
  },
  description: SHORT_DESCRIPTION,
  applicationName: NAME,
  authors: [{ name: NAME, url: SITE_URL }],
  creator: NAME,
  publisher: NAME,
  category: "technology",
  keywords: [
    "Juliette",
    "developer",
    "programmer",
    "typescript",
    "react",
    "portfolio",
    "music",
    "teacher",
  ],
  referrer: "strict-origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: `${NAME} - Developer, Musician & Teacher`,
    description: SHORT_DESCRIPTION,
    url: SITE_URL,
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
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#e8c44a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": `${SITE_URL}/#person`,
                  name: NAME,
                  description: DESCRIPTION,
                  url: SITE_URL,
                  image: `${SITE_URL}/juliette.png`,
                  sameAs: [GITHUB, LINKEDIN, X, KOFI, WCA],
                  knowsLanguage: ["English", "French"],
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  name: NAME,
                  url: SITE_URL,
                  description: SHORT_DESCRIPTION,
                  inLanguage: "en-US",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-bg-primary text-primary">
        <VantaProvider>{children}</VantaProvider>
      </body>
    </html>
  );
}