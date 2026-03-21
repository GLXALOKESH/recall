"use client"

import { DotPattern } from "@/components/ui/dot-pattern"
import { useParams } from "next/navigation"
import { Copy, ThumbsUp, Volume2, Paperclip, Sparkles, Mic, Send, Loader2 } from "lucide-react"

export default function SessionPage() {
    const params = useParams()
    const { id } = params

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#F5F3EE] pt-10" style={{ fontFamily: "var(--font-ui, 'DM Sans', sans-serif)" }}>
            {/* Background Pattern */}
            <DotPattern
                width={16}
                height={16}
                cx={1}
                cy={1}
                cr={1.5}
                className="absolute inset-0 z-0 opacity-50 text-[#C4C3CE]"
                glow={true}
            />

            {/* Session Content */}
            <div className="relative z-10 mx-auto flex h-[calc(100vh-80px)] w-full flex-col p-6 lg:flex-row gap-6">

                {/* Left Partition */}
                <div className="flex-[0.70] relative overflow-hidden rounded-[2.5rem] bg-white/40 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(26,26,46,0.04)] border border-white/60 p-6 flex flex-col items-center justify-center">

                    {/* Aurora Orbs (Colorful Gradient) */}
                    <div className="absolute -left-32 -top-32 z-0 h-96 w-96 rounded-full bg-[#00897B] opacity-20 blur-[100px]" />
                    <div className="absolute -right-32 -bottom-32 z-0 h-96 w-96 rounded-full bg-[#5849E8] opacity-20 blur-[100px]" />
                    <div className="absolute left-1/2 top-1/2 z-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F59E0B] opacity-10 blur-[80px]" />

                    {/* Glass Noise Texture */}
                    <div
                        className="absolute inset-0 z-0 opacity-[0.25] pointer-events-none mix-blend-soft-light"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                    />

                    <div className="relative z-10 flex h-full w-full flex-col">
                        
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-2 space-y-6 pb-6 w-full custom-scrollbar">
                            
                            {/* User Message */}
                            <div className="flex flex-col items-end w-full">
                                <div className="rounded-[24px] rounded-br-[8px] bg-[#5849E8] px-5 py-3 text-[15px] text-white shadow-sm max-w-[80%]">
                                    Hi, can you help me?
                                </div>
                                <span className="mt-1.5 text-[11px] text-[#9898AA] mr-1">02:32 AM</span>
                            </div>

                            {/* AI Message */}
                            <div className="flex w-full items-start gap-4">
                                {/* Shiny Orb Avatar (Curious State) */}
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#00897B] bg-[#E8F8F4] overflow-hidden shadow-[inset_0_2px_10px_rgba(0,137,123,0.2)]">
                                    <div className="h-full w-full bg-gradient-to-br from-[#E8F8F4] via-white to-[#B2DFDB] opacity-80" />
                                </div>
                                
                                <div className="flex flex-col items-start max-w-[80%]">
                                    <div className="rounded-[24px] rounded-tl-[8px] bg-white px-5 py-3.5 text-[15px] text-[#1A1A2E] shadow-sm">
                                        Hello! 👋 Of course, I'm your AI voice assistant.<br/>How can I assist you today?
                                    </div>
                                    <div className="mt-1.5 flex w-full items-center justify-between pl-1 pr-2">
                                        <span className="text-[11px] text-[#9898AA]">02:32 AM</span>
                                        <div className="flex items-center gap-3 text-[#9898AA]">
                                            <button className="hover:text-[#00897B] transition-colors"><Copy size={14} /></button>
                                            <button className="hover:text-[#00897B] transition-colors"><ThumbsUp size={14} /></button>
                                            <button className="hover:text-[#00897B] transition-colors"><Volume2 size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User Message */}
                            <div className="flex flex-col items-end w-full">
                                <div className="rounded-[24px] rounded-br-[8px] bg-[#5849E8] px-5 py-3 text-[15px] text-white shadow-sm max-w-[80%]">
                                    I want to know about voice features.
                                </div>
                                <span className="mt-1.5 text-[11px] text-[#9898AA] mr-1">02:32 AM</span>
                            </div>

                            {/* AI Message */}
                            <div className="flex w-full items-start gap-4">
                                {/* Shiny Orb Avatar (Curious State) */}
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#00897B] bg-[#E8F8F4] overflow-hidden shadow-[inset_0_2px_10px_rgba(0,137,123,0.2)]">
                                    <div className="h-full w-full bg-gradient-to-br from-[#E8F8F4] via-white to-[#B2DFDB] opacity-80" />
                                </div>
                                
                                <div className="flex flex-col items-start max-w-[80%]">
                                    <div className="rounded-[24px] rounded-tl-[8px] bg-white px-5 py-3.5 text-[15px] text-[#1A1A2E] shadow-sm">
                                        Sure! 🎤 With AI Voice Assistance, you can chat hands-free, send messages, and get instant replies.
                                    </div>
                                    <div className="mt-1.5 flex w-full items-center justify-between pl-1 pr-2">
                                        <span className="text-[11px] text-[#9898AA]">02:32 AM</span>
                                        <div className="flex items-center gap-3 text-[#9898AA]">
                                            <button className="hover:text-[#00897B] transition-colors"><Copy size={14} /></button>
                                            <button className="hover:text-[#00897B] transition-colors"><ThumbsUp size={14} /></button>
                                            <button className="hover:text-[#00897B] transition-colors"><Volume2 size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Loading Indicator */}
                            <div className="flex w-full items-center gap-4 py-2">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#00897B] bg-[#E8F8F4] overflow-hidden shadow-[inset_0_2px_10px_rgba(0,137,123,0.2)]">
                                    <div className="h-full w-full bg-gradient-to-br from-[#E8F8F4] via-white to-[#B2DFDB] opacity-80 animate-pulse" />
                                </div>
                                <div className="flex items-center gap-2 text-[14px] font-medium text-[#1A1A2E]">
                                    <Loader2 className="animate-spin text-[#00897B]" size={16} />
                                    Analyzing data, please wait...
                                </div>
                            </div>

                        </div>

                        {/* Input Area */}
                        <div className="mt-auto pt-4 relative">
                            {/* The glass input container */}
                            <div className="rounded-3xl bg-white/70 backdrop-blur-md border border-white p-2 shadow-[0_4px_20px_rgba(26,26,46,0.04)]">
                                <textarea
                                    className="w-full resize-none border-none bg-transparent px-4 py-3 pb-8 text-[15px] text-[#1A1A2E] placeholder-[#9898AA] focus:ring-0 focus:outline-none"
                                    placeholder="Ask me anything..."
                                    rows={1}
                                />
                                
                                <div className="flex items-center justify-between px-2 pb-1">
                                    
                                    {/* Left Tools */}
                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center gap-1.5 rounded-full border border-[#E2DFD8] bg-white px-3 py-1.5 text-[12px] font-medium text-[#4A4A68] hover:bg-[#F7F6F2] transition-colors">
                                            <Paperclip size={13} /> Attach
                                        </button>
                                        <button className="flex items-center gap-1.5 rounded-full border border-[#E2DFD8] bg-white px-3 py-1.5 text-[12px] font-medium text-[#4A4A68] hover:bg-[#F7F6F2] transition-colors">
                                            <Sparkles size={13} /> Deep Think
                                        </button>
                                    </div>

                                    {/* Right Tools */}
                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center gap-1.5 rounded-full border border-[#E2DFD8] bg-white px-3 py-1.5 text-[12px] font-medium text-[#4A4A68] hover:bg-[#F7F6F2] transition-colors">
                                            <Mic size={13} /> Voice
                                        </button>
                                        <button className="flex items-center gap-1.5 rounded-full text-white px-4 py-1.5 text-[13px] font-semibold transition hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                                            style={{ background: "linear-gradient(135deg, #00897B 0%, #00695C 100%)" }}
                                        >
                                            <Send size={13} /> Send
                                        </button>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Partition */}
                <div className="flex-[0.30] flex flex-col gap-4">

                    {/* Right Top Section */}
                    <div className="flex-[0.4] rounded-3xl bg-white/70 backdrop-blur-md shadow-sm border border-[#E2DFD8] p-6 flex flex-col items-center justify-center">
                        <p className="text-[#9898AA] text-sm">Right Top Empty</p>
                    </div>

                    {/* Right Bottom Section */}
                    <div className="flex-[0.6] rounded-3xl bg-white/70 backdrop-blur-md shadow-sm border border-[#E2DFD8] p-6 flex flex-col items-center justify-center">
                        <p className="text-[#9898AA] text-sm">Right Bottom Empty</p>
                    </div>

                </div>
            </div>
        </div>
    )
}
