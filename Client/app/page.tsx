"use client"

import Link from "next/link"
import { Brain, BookOpen, Sparkles, Lightbulb, BarChart2, MessageCircle, ArrowRight, CheckCircle, AlertCircle, X } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useEffect, useState, Suspense } from "react"

const features = [
  {
    icon: <MessageCircle size={20} strokeWidth={1.8} />,
    color: "#00897B",
    bg: "rgba(0,137,123,0.10)",
    title: "Teach Mia",
    desc: "Explain your topic to Mia, an AI student who asks questions like a real learner — not a tutor.",
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.8} />,
    color: "#5849E8",
    bg: "rgba(88,73,232,0.10)",
    title: "Live knowledge radar",
    desc: "A radar chart updates in real time as you cover each concept, exposing gaps as they happen.",
  },
  {
    icon: <Brain size={20} strokeWidth={1.8} />,
    color: "#00897B",
    bg: "rgba(0,137,123,0.10)",
    title: "Misconception detection",
    desc: "Mia quietly plants a wrong belief. If you don't catch it, the report flags it as a blind spot.",
  },
  {
    icon: <Lightbulb size={20} strokeWidth={1.8} />,
    color: "#5849E8",
    bg: "rgba(88,73,232,0.10)",
    title: "Mastery report",
    desc: "Every session ends with a full animated report — a score, concept notes, and your best moment.",
  },
  {
    icon: <BookOpen size={20} strokeWidth={1.8} />,
    color: "#00897B",
    bg: "rgba(0,137,123,0.10)",
    title: "Add source material",
    desc: "Paste a URL or upload a PDF. Mia adapts her knowledge to exactly what you're trying to learn.",
  },
  {
    icon: <Sparkles size={20} strokeWidth={1.8} />,
    color: "#5849E8",
    bg: "rgba(88,73,232,0.10)",
    title: "Shareable results",
    desc: "Download your mastery card or share a public link to your session report with anyone.",
  },
]

const steps = [
  { n: "01", label: "Enter your topic", sub: "Any subject — from photosynthesis to React hooks." },
  { n: "02", label: "Teach Mia live", sub: "Mia asks questions. You explain. Gaps surface naturally." },
  { n: "03", label: "Get your report", sub: "Score, blind spots, best moment — all in one place." },
]

function AuthToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (searchParams.get("auth") === "required") {
      setVisible(true)
      // Remove the query param from the URL cleanly so it doesn't stay there
      router.replace(pathname, { scroll: false })

      const timer = setTimeout(() => setVisible(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams, router, pathname])

  if (!visible) return null

  return (
    <div
      className="fixed top-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl px-4 py-3 shadow-lg transition-all animate-in fade-in slide-in-from-top-4"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2DFD8",
        fontFamily: "var(--font-ui, 'DM Sans', sans-serif)",
      }}
    >
      <AlertCircle size={18} style={{ color: "#F59E0B" }} />
      <span style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A2E" }}>
        Please sign in or create an account to continue.
      </span>
      <button
        onClick={() => setVisible(false)}
        className="ml-2 rounded-md p-1 hover:bg-zinc-100"
      >
        <X size={14} style={{ color: "#9898AA" }} />
      </button>
    </div>
  )
}

export default function Home() {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: "#F5F3EE", fontFamily: "var(--font-ui, 'DM Sans', sans-serif)" }}
    >
      <Suspense fallback={null}>
        <AuthToast />
      </Suspense>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 pt-28 pb-20 text-center">

        {/* Pill badge */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: "rgba(88,73,232,0.08)",
            border: "1px solid rgba(88,73,232,0.18)",
          }}
        >
          <Sparkles size={13} style={{ color: "#5849E8" }} />
          <span style={{ fontSize: "12px", fontWeight: 500, color: "#5849E8", letterSpacing: "0.04em" }}>
            AI-powered learning verification
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display, 'Fraunces', serif)",
            fontSize: "clamp(2.6rem, 6vw, 4.2rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#1A1A2E",
            lineHeight: 1.15,
            maxWidth: "720px",
            marginBottom: "24px",
          }}
        >
          Teach it.{" "}
          <span style={{ color: "#00897B" }}>Prove it.</span>{" "}
          Own it.
        </h1>

        {/* Sub */}
        <p
          style={{
            fontSize: "18px",
            fontWeight: 400,
            color: "#4A4A68",
            maxWidth: "520px",
            lineHeight: 1.7,
            marginBottom: "40px",
          }}
        >
          Recall tests your understanding by making you teach an AI student named
          Mia. If you can explain it, you own it.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/sessions">
            <button
              className="flex items-center gap-2 rounded-2xl px-7 py-3.5 text-white transition active:scale-[0.98]"
              style={{
                fontFamily: "var(--font-ui, 'DM Sans', sans-serif)",
                fontSize: "15px",
                fontWeight: 600,
                background: "linear-gradient(135deg, #00897B 0%, #00695C 100%)",
                boxShadow: "0 4px 24px rgba(0,137,123,0.25)",
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.background = "linear-gradient(135deg, #00695C 0%, #004D40 100%)")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.background = "linear-gradient(135deg, #00897B 0%, #00695C 100%)")
              }
            >
              Start teaching <ArrowRight size={16} />
            </button>
          </Link>
          <Link href="/sessions">
            <button
              className="flex items-center gap-2 rounded-2xl px-7 py-3.5 transition"
              style={{
                fontFamily: "var(--font-ui, 'DM Sans', sans-serif)",
                fontSize: "15px",
                fontWeight: 500,
                color: "#4A4A68",
                background: "transparent",
                border: "1px solid #E2DFD8",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#C8C5BC"
                e.currentTarget.style.background = "#FFFFFF"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#E2DFD8"
                e.currentTarget.style.background = "transparent"
              }}
            >
              View sessions
            </button>
          </Link>
        </div>

        {/* Social proof strip */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {["No quizzes", "No flashcards", "Real understanding"].map(t => (
            <span key={t} className="flex items-center gap-1.5" style={{ fontSize: "13px", color: "#9898AA" }}>
              <CheckCircle size={13} style={{ color: "#00897B" }} />
              {t}
            </span>
          ))}
        </div>
      </main>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ background: "#FFFFFF" }}>
        <div className="mx-auto max-w-4xl">
          <p
            className="mb-2 text-center"
            style={{ fontSize: "11px", fontWeight: 500, color: "#9898AA", letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            How it works
          </p>
          <h2
            className="mb-14 text-center"
            style={{ fontSize: "28px", fontWeight: 600, color: "#1A1A2E", lineHeight: 1.3 }}
          >
            Three steps to real mastery
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map(s => (
              <div
                key={s.n}
                className="rounded-2xl p-6"
                style={{ background: "#F7F6F2", border: "1px solid #E2DFD8" }}
              >
                <span
                  className="mb-3 block"
                  style={{
                    fontFamily: "var(--font-display, 'Fraunces', serif)",
                    fontSize: "32px",
                    fontWeight: 300,
                    color: "#00897B",
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </span>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A2E", marginBottom: "6px" }}>
                  {s.label}
                </h3>
                <p style={{ fontSize: "14px", color: "#4A4A68", lineHeight: 1.6 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ background: "#F5F3EE" }}>
        <div className="mx-auto max-w-4xl">
          <p
            className="mb-2 text-center"
            style={{ fontSize: "11px", fontWeight: 500, color: "#9898AA", letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            Features
          </p>
          <h2
            className="mb-14 text-center"
            style={{ fontSize: "28px", fontWeight: 600, color: "#1A1A2E", lineHeight: 1.3 }}
          >
            Built to expose what you don't know
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(f => (
              <div
                key={f.title}
                className="rounded-2xl p-6 transition"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2DFD8",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#C8C5BC")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#E2DFD8")}
              >
                <div
                  className="mb-4 flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: f.bg, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A2E", marginBottom: "6px" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#4A4A68", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ background: "#FFFFFF" }}>
        <div
          className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-3xl px-10 py-14 text-center"
          style={{
            background: "linear-gradient(135deg, #00897B 0%, #00695C 100%)",
            boxShadow: "0 8px 40px rgba(0,137,123,0.28)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display, 'Fraunces', serif)",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#FFFFFF",
              lineHeight: 1.25,
              maxWidth: "440px",
            }}
          >
            Ready to find out what you actually know?
          </h2>
          <Link href="/onboard">
            <button
              className="flex items-center gap-2 rounded-2xl px-8 py-3.5 transition active:scale-[0.98]"
              style={{
                fontFamily: "var(--font-ui, 'DM Sans', sans-serif)",
                fontSize: "15px",
                fontWeight: 600,
                background: "#FFFFFF",
                color: "#00695C",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F5F3EE")}
              onMouseLeave={e => (e.currentTarget.style.background = "#FFFFFF")}
            >
              Start teaching <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer
        className="flex items-center justify-between px-8 py-5"
        style={{ borderTop: "1px solid #E2DFD8", background: "#F5F3EE" }}
      >
        <span
          style={{
            fontFamily: "var(--font-display, 'Fraunces', serif)",
            fontSize: "18px",
            fontWeight: 400,
            color: "#1A1A2E",
          }}
        >
          Recall
        </span>
        <span style={{ fontSize: "12px", color: "#9898AA" }}>
          Teach it. Prove it. Own it.
        </span>
      </footer>
    </div>
  )
}
