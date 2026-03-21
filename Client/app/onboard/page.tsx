"use client"

import { cn } from "@/lib/utils"
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern"
import { OrbitingCircles } from "@/components/ui/orbiting-circles"
import { Brain, BookOpen, Sparkles, Lightbulb, Pencil, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const LOADING_MESSAGES = [
    "Understanding your topic...",
    "Building Mia's knowledge...",
    "Preparing your session..."
]

const Onboard = () => {
    const router = useRouter()
    const [topic, setTopic] = useState("")
    const [isShaking, setIsShaking] = useState(false)
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
    const [messageIndex, setMessageIndex] = useState(0)

    useEffect(() => {
        if (status !== "loading") return
        
        const timer1 = setTimeout(() => setMessageIndex(1), 1500)
        const timer2 = setTimeout(() => setMessageIndex(2), 3000)
        return () => { clearTimeout(timer1); clearTimeout(timer2) }
    }, [status])

    const handleStart = async () => {
        if (!topic.trim()) {
            setIsShaking(true)
            setTimeout(() => setIsShaking(false), 500) // Reset shake after animation
            setStatus("idle")
            return
        }

        setStatus("loading")
        setMessageIndex(0)

        try {
            // Simulated API call (replace with real fetch later)
            await new Promise((resolve) => setTimeout(resolve, 4000))
            
            // Navigate on success
            router.push(`/sessions/new`) // Update destination as needed
        } catch (error) {
            setStatus("error")
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#F5F3EE]">
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out 0s 2;
                }
            `}</style>
            {/* Hidden SVG noise filter definition */}
            <svg className="absolute h-0 w-0" aria-hidden="true">
                <defs>
                    {/* Colourful grain: biased toward brand teal (#00897B) + violet (#5849E8) */}
                    <filter id="grain" x="0%" y="0%" width="100%" height="100%"
                        colorInterpolationFilters="sRGB">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.68"
                            numOctaves="4"
                            seed="5"
                            stitchTiles="stitch"
                            result="noise"
                        />
                        {/*
                          Color matrix maps raw turbulence toward brand palette:
                          R col → violet tones  (88/255 ≈ 0.35 base)
                          G col → teal tones    (137/255 ≈ 0.54 base)
                          B col → shared high   (violet 232 + teal 123 → bias 0.70)
                          Alpha → grain threshold for density
                        */}
                        <feColorMatrix
                            type="matrix"
                            values="0.4 0   0   0  0.22
                                    0   0.7 0   0  0.32
                                    0   0   1.3 0  0.38
                                    0   0   0  15 -6"
                            in="noise"
                            result="coloredNoise"
                        />
                        <feBlend in="SourceGraphic" in2="coloredNoise" mode="screen" />
                    </filter>
                </defs>
            </svg>

            {/* Full-page interactive grid background */}
            <InteractiveGridPattern
                width={50}
                height={50}
                squares={[40, 30]}
                className={cn(
                    "mask-[radial-gradient(900px_circle_at_center,white,transparent)]",
                    "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
                )}
                squaresClassName="hover:fill-black/5 stroke-black/10"
            />

            {/* Centered glassmorphism card */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
                <div
                    className="relative flex w-full max-w-3xl overflow-hidden rounded-3xl shadow-2xl"
                    style={{
                        border: "1px solid rgba(255,255,255,0.60)",
                        background: "rgba(255,255,255,0.48)",
                        backdropFilter: "blur(24px) saturate(180%)",
                        WebkitBackdropFilter: "blur(24px) saturate(180%)",
                    }}
                >
                    {/* Colourful grain overlay on card */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-10 rounded-3xl"
                        style={{
                            filter: "url(#grain)",
                            opacity: 0.22,
                            background: "rgba(255,255,255,0.0)",
                            mixBlendMode: "screen",
                        }}
                    />

                    {/* Left panel — input & actions / loading state */}
                    <div className="relative z-20 flex flex-1 flex-col gap-5 p-8" style={{ fontFamily: "var(--font-ui, 'DM Sans', sans-serif)" }}>
                        
                        {/* ── ALIGN ITEMS CENTER FOR LOADING STATE ── */}
                        {status === "loading" ? (
                            <div className="flex h-full flex-col items-center justify-center gap-6 animate-in fade-in duration-300">
                                <Loader2 className="animate-spin" size={32} style={{ color: "#00897B" }} />
                                <div className="relative h-8 w-full">
                                    {LOADING_MESSAGES.map((msg, index) => (
                                        <p
                                            key={msg}
                                            className={cn(
                                                "absolute inset-0 text-center transition-opacity duration-300",
                                                messageIndex === index ? "opacity-100" : "opacity-0"
                                            )}
                                            style={{
                                                fontFamily: "var(--font-display, 'Fraunces', serif)",
                                                fontSize: "19px",
                                                fontWeight: 300,
                                                fontStyle: "italic",
                                                color: "#1A1A2E",
                                            }}
                                        >
                                            {msg}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full flex-col gap-5 animate-in fade-in duration-300">
                                {/* Heading */}
                                <h2
                                    style={{
                                        fontFamily: "var(--font-ui, 'DM Sans', sans-serif)",
                                        fontSize: "20px",
                                        fontWeight: 600,
                                        color: "#1A1A2E",
                                        lineHeight: 1.4,
                                    }}
                                >
                                    Enter your topic
                                </h2>

                                {/* Text input area with error message */}
                                <div className="flex flex-col gap-2">
                                    <textarea
                                        rows={5}
                                        value={topic}
                                        onChange={(e) => {
                                            setTopic(e.target.value)
                                            if (status === "error") setStatus("idle")
                                        }}
                                        placeholder="What do you want to teach today? Try 'Photosynthesis' or 'How React hooks work'"
                                        className={cn(
                                            "w-full resize-none rounded-2xl px-4 py-3 outline-none transition shadow-inner",
                                            isShaking && "animate-shake border-[#EF4444]"
                                        )}
                                        style={{
                                            fontFamily: "var(--font-ui, 'DM Sans', sans-serif)",
                                            fontSize: "16px",
                                            fontWeight: 400,
                                            fontStyle: topic ? "normal" : "italic",
                                            background: "#F0EEE9",
                                            border: isShaking || status === "error" ? "1px solid #EF4444" : "1px solid #E2DFD8",
                                            color: "#1A1A2E",
                                            lineHeight: 1.6,
                                        }}
                                        onFocus={e => {
                                            if (!isShaking && status !== "error") e.currentTarget.style.border = "1px solid #00897B"
                                            e.currentTarget.style.background = "rgba(255,255,255,0.9)"
                                            e.currentTarget.style.fontStyle = "normal"
                                        }}
                                        onBlur={e => {
                                            if (!isShaking && status !== "error") e.currentTarget.style.border = "1px solid #E2DFD8"
                                            e.currentTarget.style.background = "#F0EEE9"
                                            e.currentTarget.style.fontStyle = topic ? "normal" : "italic"
                                        }}
                                    />
                                    {isShaking && (
                                        <span className="text-sm px-1 animate-in fade-in" style={{ color: "#EF4444" }}>
                                            Please enter a topic first.
                                        </span>
                                    )}
                                </div>

                                {/* Add source material — centered */}
                                <button
                                    className="mx-auto flex items-center gap-2 rounded-xl px-4 py-2.5 transition"
                                    style={{
                                        fontFamily: "var(--font-ui, 'DM Sans', sans-serif)",
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        border: "1.5px dashed #C8C5BC",
                                        color: "#4A4A68",
                                        background: "transparent",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = "#00897B"
                                        e.currentTarget.style.color = "#00695C"
                                        e.currentTarget.style.background = "rgba(0,137,123,0.06)"
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = "#C8C5BC"
                                        e.currentTarget.style.color = "#4A4A68"
                                        e.currentTarget.style.background = "transparent"
                                    }}
                                >
                                    <span style={{ fontSize: "16px", lineHeight: 1 }}>⊕</span>
                                    Add source material{" "}
                                    <span style={{ color: "#9898AA" }}>(optional)</span>
                                </button>

                                {/* API Error Message */}
                                {status === "error" && (
                                    <span className="mx-auto text-sm animate-in fade-in" style={{ color: "#EF4444" }}>
                                        Something went wrong — want to try again?
                                    </span>
                                )}

                                {/* Start Teaching CTA — #00897B → #00695C per color guide */}
                                <button
                                    onClick={handleStart}
                                    className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-white shadow-lg transition active:scale-[0.98]"
                                    style={{
                                        fontFamily: "var(--font-ui, 'DM Sans', sans-serif)",
                                        fontSize: "15px",
                                        fontWeight: 600,
                                        background: "linear-gradient(135deg, #00897B 0%, #00695C 100%)",
                                        letterSpacing: 0,
                                    }}
                                    onMouseEnter={e =>
                                    (e.currentTarget.style.background =
                                        "linear-gradient(135deg, #00695C 0%, #004D40 100%)")
                                    }
                                    onMouseLeave={e =>
                                    (e.currentTarget.style.background =
                                        "linear-gradient(135deg, #00897B 0%, #00695C 100%)")
                                    }
                                >
                                    Start Teaching →
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="w-px self-stretch" style={{ background: "rgba(255,255,255,0.50)" }} />

                    {/* Right panel — orbiting circles */}
                    <div className="relative z-20 flex flex-1 items-center justify-center p-6">
                        <div className="relative flex h-[280px] w-[280px] items-center justify-center">

                            {/* Center label */}
                            <div className="flex flex-col items-center gap-1 text-center">
                                <span
                                    style={{
                                        fontFamily: "var(--font-ui, 'DM Sans', sans-serif)",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        color: "#9898AA",
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Recall
                                </span>
                            </div>

                            {/* Outer orbit — teal, slower */}
                            <OrbitingCircles
                                radius={120}
                                duration={18}
                                iconSize={34}
                                path
                            >
                                <div
                                    className="flex items-center justify-center rounded-full shadow-sm"
                                    style={{
                                        width: 38,
                                        height: 38,
                                        background: "rgba(0,137,123,0.10)",
                                        color: "#00897B",
                                    }}
                                >
                                    <Brain size={18} strokeWidth={1.8} />
                                </div>
                                <div
                                    className="flex items-center justify-center rounded-full shadow-sm"
                                    style={{
                                        width: 38,
                                        height: 38,
                                        background: "rgba(0,137,123,0.10)",
                                        color: "#00897B",
                                    }}
                                >
                                    <BookOpen size={18} strokeWidth={1.8} />
                                </div>
                                <div
                                    className="flex items-center justify-center rounded-full shadow-sm"
                                    style={{
                                        width: 38,
                                        height: 38,
                                        background: "rgba(0,137,123,0.10)",
                                        color: "#00897B",
                                    }}
                                >
                                    <Sparkles size={18} strokeWidth={1.8} />
                                </div>
                            </OrbitingCircles>

                            {/* Inner orbit — violet, reversed, faster */}
                            <OrbitingCircles
                                radius={58}
                                duration={12}
                                reverse
                                iconSize={28}
                                path
                            >
                                <div
                                    className="flex items-center justify-center rounded-full shadow-sm"
                                    style={{
                                        width: 30,
                                        height: 30,
                                        background: "rgba(88,73,232,0.10)",
                                        color: "#5849E8",
                                    }}
                                >
                                    <Lightbulb size={14} strokeWidth={1.8} />
                                </div>
                                <div
                                    className="flex items-center justify-center rounded-full shadow-sm"
                                    style={{
                                        width: 30,
                                        height: 30,
                                        background: "rgba(88,73,232,0.10)",
                                        color: "#5849E8",
                                    }}
                                >
                                    <Pencil size={14} strokeWidth={1.8} />
                                </div>
                            </OrbitingCircles>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Onboard
