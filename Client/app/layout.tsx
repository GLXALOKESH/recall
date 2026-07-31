import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { BACKEND_URL } from "@/lib/config"; 

const dmSans = DM_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Recall",
  description: "Your memory, organized.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(BACKEND_URL)
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}
      >
        <body
          className="min-h-full flex flex-col"
          style={{ fontFamily: "var(--font-ui, 'DM Sans', sans-serif)" }}
        >
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
