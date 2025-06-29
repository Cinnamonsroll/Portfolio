import type { Metadata } from "next";
import { Handlee } from "next/font/google";
import "./globals.css";
import Alert from "./alert";

const handlee = Handlee({
  variable: "--font-handlee",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Pancake portfolio!",
  description: "A café for all of your wonders about me!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/pancake.png"
          type="image/png"
        />
      </head>
      <body className={`${handlee.variable} antialiased`}>
        <Alert />
        {children}
      </body>
    </html>
  );
}
