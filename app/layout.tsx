import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { NAME, DESCRIPTION } from "@/lib/constants";
import "./globals.css";
import { VantaProvider } from "@/components/providers/vanta";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: NAME,
    template: `%s — ${NAME}`,
  },
  description: DESCRIPTION,
  metadataBase: new URL("https://pancake.wtf"),
  openGraph: {
    title: NAME,
    description: DESCRIPTION,
    siteName: NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: NAME,
    description: DESCRIPTION,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#e8c44a",
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
              "@type": "Person",
              name: NAME,
              description: DESCRIPTION,
              url: "https://pancake.wtf",
              sameAs: ["https://github.com/Cinnamonsroll"],
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
