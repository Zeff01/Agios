import { GeistSans } from "geist/font/sans";
import PaddleInitializer from "@/components/paddle/PaddleInitializer";
import PaddleEventListener from "@/components/paddle/PaddleEventListener";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col ">{children}</main>
        <PaddleInitializer />
        <PaddleEventListener />
        <Toaster />
      </body>
    </html>
  );
}
