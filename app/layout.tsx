import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const interMono = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-mono", weight: ["400", "500"] }); // Using Inter Tight as a proxy for "Inter TT Mono" or similar technical feel if exact font not available via Google Fonts

export const metadata: Metadata = {
  title: "Vismo CRM",
  description: "Industrial Tech meets Digital Brutalism",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.variable, interMono.variable, "font-sans bg-background-default text-text-primary")}>
        {children}
      </body>
    </html>
  );
}
