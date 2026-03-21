import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { ClerkProvider, SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
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
              top: 0,
              right: 0,
              zIndex: 50,
              padding: "14px 24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Show when="signed-out">
              <SignInButton>
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
              <SignUpButton>
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
          </header>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
