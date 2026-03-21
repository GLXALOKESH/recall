"use client"

import { DotPattern } from "@/components/ui/dot-pattern"
import { useParams } from "next/navigation"
import { Copy, ThumbsUp, Volume2, Paperclip, Sparkles, Mic, Send, Loader2 } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import RadarChart from "@/components/RadarChart"

export default function SessionPage() {
    const params = useParams()
    const { id } = params

    const [sessionData, setSessionData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Chat State
    const [messages, setMessages] = useState<any[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isStreaming, setIsStreaming] = useState(false)
    const messagesContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!id) return;
        const fetchSession = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/sessions/${id}`);
                const data = await res.json();
                if (data.success) {
                    setSessionData(data.data);
                    if (data.data.messages) {
                        setMessages(data.data.messages.map((m: any) => ({
                            role: m.role,
                            content: m.clean_text || m.content
                        })));
                    } else {
                        setMessages([{
                            role: "assistant",
                            content: "Hi! I'm Mia. I'm ready to learn about this topic from you. Where should we start?"
                        }]);
                    }
                }
            } catch (err) {
                console.error("Error fetching session:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSession();
    }, [id]);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!inputValue.trim() || isStreaming) return;

        const userMsg = inputValue;
        setInputValue("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setMessages(prev => [...prev, { role: "assistant", content: "" }]);
        setIsStreaming(true);

        try {
            const response = await fetch(`http://localhost:5000/api/sessions/${id}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.text) {
                                accumulatedContent += data.text;
                                setMessages(prev => {
                                    const newMsgs = [...prev];
                                    // Strip the <metadata> block visually so the user never sees it stream in!
                                    const displayContent = accumulatedContent.split('<metadata>')[0].trim();
                                    newMsgs[newMsgs.length - 1].content = displayContent;
                                    return newMsgs;
                                });
                            }
                            if (data.done) {
                                // Final metadata payload 
                                setSessionData((prev: any) => {
                                    if (!prev) return prev;
                                    const newScores = { ...(prev.depthScores || {}) };
                                    if (data.metadata.concept_covered) {
                                        const oldScore = newScores[data.metadata.concept_covered] || 0;
                                        newScores[data.metadata.concept_covered] = Math.max(oldScore, data.metadata.depth_score || 0);
                                    }
                                    return { ...prev, depthScores: newScores };
                                });
                            }
                        } catch (e) {
                            // partial JSON chunk
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Chat error:", error);
        } finally {
            setIsStreaming(false);
        }
    };

    // Developer function to artificially animate the depth scores
    // so judges/users can see the smooth polygon and glowing dot transitions
    const simulateAnimation = () => {
        if (!sessionData || !sessionData.conceptTree) return;

        let currentScores = { ...(sessionData.depthScores || {}) };
        const concepts = sessionData.conceptTree.map((c: any) => c.id);

        // Ensure starting at 0
        concepts.forEach((conceptId: string) => {
            currentScores[conceptId] = 0;
        });

        setSessionData({ ...sessionData, depthScores: currentScores });

        const interval = setInterval(() => {
            // Pick a random concept that isn't mastered yet
            const upgradable = concepts.filter((cid: string) => currentScores[cid] < 5);
            if (upgradable.length === 0) {
                clearInterval(interval);
                return;
            }

            // Upgrade one
            const idToUpgrade = upgradable[Math.floor(Math.random() * upgradable.length)];
            currentScores[idToUpgrade] += 1;

            // Periodically upgrade a second one for more dynamic visual movement
            if (Math.random() > 0.5 && upgradable.length > 1) {
                const idToUpgrade2 = upgradable[Math.floor(Math.random() * upgradable.length)];
                currentScores[idToUpgrade2] = Math.min(5, currentScores[idToUpgrade2] + 1);
            }

            // Push State -> Triggers D3 UseEffect Transition
            setSessionData({ ...sessionData, depthScores: { ...currentScores } });
        }, 1200); // Trigger a transition every 1.2s
    };

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

                {/* Left Partition - Live Chat */}
                <div className="flex-[0.70] relative overflow-hidden rounded-[2.5rem] bg-white/40 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(26,26,46,0.04)] border border-white/60 p-6 flex flex-col min-h-0">

                    {/* Aurora Orbs (Colorful Gradient) */}
                    <div className="absolute -left-32 -top-32 z-0 h-96 w-96 rounded-full bg-[#00897B] opacity-20 blur-[100px]" />
                    <div className="absolute -right-32 -bottom-32 z-0 h-96 w-96 rounded-full bg-[#5849E8] opacity-20 blur-[100px]" />
                    <div className="absolute left-1/2 top-1/2 z-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F59E0B] opacity-10 blur-[80px]" />

                    {/* Glass Noise Texture */}
                    <div
                        className="absolute inset-0 z-0 opacity-[0.25] pointer-events-none mix-blend-soft-light"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                    />

                    <div className="relative z-10 flex h-full w-full flex-col min-h-0">

                        {/* Messages Area */}
                        <div
                            ref={messagesContainerRef}
                            className="flex-1 overflow-y-auto px-2 space-y-6 pb-6 w-full custom-scrollbar min-h-0"
                        >

                            {messages.map((msg, idx) => {
                                if (msg.role === "user") {
                                    return (
                                        <div key={idx} className="flex flex-col items-end w-full">
                                            <div className="rounded-[24px] rounded-br-[8px] bg-[#5849E8] px-5 py-3 text-[15px] text-white shadow-sm max-w-[80%] whitespace-pre-wrap">
                                                {msg.content}
                                            </div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={idx} className="flex w-full items-start gap-4">
                                            {/* Shiny Orb Avatar (Curious State) */}
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#00897B] bg-[#E8F8F4] overflow-hidden shadow-[inset_0_2px_10px_rgba(0,137,123,0.2)]">
                                                <div className="h-full w-full bg-linear-to-br from-[#E8F8F4] via-white to-[#B2DFDB] opacity-80" />
                                            </div>

                                            <div className="flex flex-col items-start max-w-[80%]">
                                                <div className="rounded-[24px] rounded-tl-[8px] bg-white px-5 py-3.5 text-[15px] text-[#1A1A2E] shadow-sm whitespace-pre-wrap">
                                                    {msg.content === "" ? (
                                                        <Loader2 className="animate-spin text-[#00897B]" size={16} />
                                                    ) : (
                                                        msg.content
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        </div>

                        {/* Input Area */}
                        <div className="mt-auto pt-4 relative flex items-center gap-3 w-full">

                            {/* The glass input capsule */}
                            <div className="flex-1 rounded-full bg-white/80 backdrop-blur-md border border-white px-6 py-3.5 shadow-sm">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') sendMessage()
                                    }}
                                    disabled={isStreaming}
                                    className="w-full border-none bg-transparent text-[15px] text-[#1A1A2E] placeholder-[#9898AA] focus:ring-0 focus:outline-none disabled:opacity-50"
                                    placeholder="Ask me anything..."
                                />
                            </div>

                            {/* Circular Action Buttons */}
                            <div className="flex items-center gap-2 shrink-0">
                                <button className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-[#E2DFD8] bg-white/80 backdrop-blur-md text-[#4A4A68] hover:bg-white transition-colors shadow-sm cursor-pointer">
                                    <Mic size={20} />
                                </button>
                                <button
                                    onClick={sendMessage}
                                    disabled={!inputValue.trim() || isStreaming}
                                    className="flex h-[50px] w-[50px] items-center justify-center rounded-full text-white shadow-md transition-transform hover:scale-[1.05] active:scale-[0.95] cursor-pointer disabled:opacity-50 disabled:hover:scale-100"
                                    style={{ background: "linear-gradient(135deg, #00897B 0%, #00695C 100%)" }}
                                >
                                    <Send size={18} className="-ml-0.5" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Partition */}
                <div className="flex-[0.30] flex flex-col gap-4">

                    {/* Right Top Section - Avatar Video Area */}
                    <div className="flex-[0.4] rounded-3xl bg-[#1A1A2E] shadow-lg border border-[#E2DFD8]/20 p-0 flex flex-col items-center justify-center relative overflow-hidden">

                        {/* 
                          PRO-TIP: To make the black background of your avatar completely transparent:
                          Apply the 'mix-blend-screen' CSS class to the video element.
                          Because the lights are cyan, they look best against this deep dark container (#1A1A2E) 
                          rather than the super bright page background!
                        */}
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-95 pointer-events-none"
                            src={"/GIF_Animation_Creation.mp4"}
                        />
                    </div>

                    {/* Right Bottom Section - Concept Radar */}
                    <div className="flex-[0.6] rounded-3xl bg-white/70 backdrop-blur-md shadow-sm border border-[#E2DFD8] p-4 flex flex-col items-center justify-center relative overflow-hidden">
                        {!isLoading && sessionData && sessionData.conceptTree ? (
                            <RadarChart
                                concepts={sessionData.conceptTree}
                                depthScores={sessionData.depthScores || {}}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full w-full text-[#9898AA]">
                                <Loader2 className="animate-spin text-[#00897B] mb-2" size={24} />
                                <p className="text-sm">Mapping Concepts...</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Dev Floating Button */}
            <button
                onClick={simulateAnimation}
                disabled={!sessionData || !sessionData.conceptTree}
                className="absolute bottom-6 right-6 z-50 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:scale-105 active:scale-95 disabled:opacity-50"
                style={{ background: "#5849E8" }}
                title="Simulate AI Progression"
            >
                Simulate AI
            </button>

        </div>
    )
}
