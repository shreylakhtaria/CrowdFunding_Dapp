import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "CrowdFunding App",
  description:
    "This is CrowdFunding App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-700">
        <ThirdwebProvider>
          <Navbar />
          {children} {/* Add Footer component here */}
        </ThirdwebProvider>
      </body>
    </html>
  );
}