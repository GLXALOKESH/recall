import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { ClerkProvider, SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";

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
          <header
            style={{
              position: "fixed",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "calc(100% - 40px)",
              maxWidth: "1100px",
              zIndex: 50,
              padding: "12px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display, 'Fraunces', serif)",
                    fontSize: "24px",
                    fontWeight: 400,
                    color: "#00897B",
                  }}
                >
                  Recall
                </span>
              </Link>
              <nav style={{ display: "flex", gap: "20px" }}>
                <Link href="/sessions" style={{ textDecoration: "none", color: "#4A4A68", fontSize: "15px", fontWeight: 500 }}>
                  Sessions
                </Link>
                <Link href="/onboard" style={{ textDecoration: "none", color: "#4A4A68", fontSize: "15px", fontWeight: 500 }}>
                  New Session
                </Link>
              </nav>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button
                    style={{
                      fontFamily: "var(--font-ui, 'DM Sans', sans-serif)",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#4A4A68",
                      background: "transparent",
                      border: "1px solid #E2DFD8",
                      borderRadius: "10px",
                      padding: "6px 14px",
                      cursor: "pointer",
                    }}
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    style={{
                      fontFamily: "var(--font-ui, 'DM Sans', sans-serif)",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#fff",
                      background: "linear-gradient(135deg, #00897B 0%, #00695C 100%)",
                      border: "none",
                      borderRadius: "10px",
                      padding: "6px 14px",
                      cursor: "pointer",
                    }}
                  >
                    Sign up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
