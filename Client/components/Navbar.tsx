"use client"

import { useClerk, useUser, UserButton } from "@clerk/nextjs"
import Link from "next/link"

export default function Navbar() {
  const { openSignIn, openSignUp } = useClerk()
  const { isSignedIn } = useUser()

  return (
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
        {!isSignedIn ? (
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
            <button
              onClick={() => openSignIn()}
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
            <button
              onClick={() => openSignUp()}
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
          </div>
        ) : (
          <UserButton />
        )}
      </div>
    </header>
  )
}
