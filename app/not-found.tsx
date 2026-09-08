import type { Metadata } from "next";
import { BackButton } from "@/components/ui/back-button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen w-full max-w-3xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-8">
      <div>
        <BackButton href="/" />
      </div>

      <h1 className="text-[28px] md:text-[36px] font-semibold text-primary leading-tight">
        Page not found
      </h1>
      <p className="text-secondary text-sm md:text-base leading-relaxed max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
    </main>
  );
}