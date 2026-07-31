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
              left: "0",
              right: "0",
              margin: "0 auto",
              width: "calc(100% - 40px)",
              maxWidth: "1100px",
              zIndex: 50,
              padding: "14px 28px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: "28px",
              background: "var(--liquid-bg)",
              WebkitBackdropFilter: "blur(var(--liquid-blur)) saturate(var(--liquid-saturate))",
              backdropFilter: "blur(var(--liquid-blur)) saturate(var(--liquid-saturate))",
              border: "1px solid var(--liquid-border)",
              boxShadow:
                "0 8px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 0 rgba(255, 255, 255, 0.3)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "36px" }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display, 'Fraunces', serif)",
                    fontSize: "26px",
                    fontWeight: 400,
                    color: "#00897B",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Recall
                </span>
              </Link>
              <nav style={{ display: "flex", gap: "6px" }}>
                <Link
                  href="/sessions"
                  style={{
                    textDecoration: "none",
                    color: "var(--nav-link-color)",
                    fontSize: "14px",
                    fontWeight: 500,
                    padding: "7px 14px",
                    borderRadius: "12px",
                    letterSpacing: "0.01em",
                    transition: "all 0.3s ease",
                  }}
                >
                  Sessions
                </Link>
                <Link
                  href="/onboard"
                  style={{
                    textDecoration: "none",
                    color: "var(--nav-link-color)",
                    fontSize: "14px",
                    fontWeight: 500,
                    padding: "7px 14px",
                    borderRadius: "12px",
                    letterSpacing: "0.01em",
                    transition: "all 0.3s ease",
                  }}
                >
                  New Session
                </Link>
              </nav>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Show when="signed-out">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "14px",
                    background: "var(--btn-group-bg)",
                    border: "1px solid var(--btn-group-border)",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
                  }}
                >
                  <SignInButton mode="modal">
                    <button
                      style={{
                        fontFamily: "var(--font-ui, 'DM Sans', sans-serif)",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--btn-ghost-color)",
                        background: "var(--btn-ghost-bg)",
                        border: "none",
                        padding: "8px 18px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        borderRight: "1px solid var(--btn-group-border)",
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
                        color: "var(--btn-solid-color)",
                        background: "var(--btn-solid-bg)",
                        border: "none",
                        padding: "8px 18px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Sign up
                    </button>
                  </SignUpButton>
                </div>
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
