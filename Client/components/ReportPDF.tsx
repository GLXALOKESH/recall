"use client"

import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"

const s = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica", backgroundColor: "#F5F3EE" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
    brand: { fontSize: 22, fontFamily: "Helvetica-Bold" },
    date: { fontSize: 8, color: "#9898AA", textTransform: "uppercase", letterSpacing: 2, marginTop: 2 },
    scoreBox: { backgroundColor: "#00897B", color: "#fff", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, fontSize: 16, fontFamily: "Helvetica-Bold" },
    sectionLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 2, color: "#4A4A68", marginBottom: 6 },
    scoreNum: { fontSize: 56, fontFamily: "Helvetica-Bold", textAlign: "center", color: "#00695C", marginBottom: 2 },
    scoreLabel: { fontSize: 11, fontFamily: "Helvetica-Bold", textTransform: "uppercase", textAlign: "center", color: "#00695C", letterSpacing: 1, marginBottom: 20 },
    topic: { fontSize: 24, fontFamily: "Helvetica-Bold", marginBottom: 20 },
    quoteCard: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 20, border: "1 solid #fff" },
    quoteText: { fontSize: 11, fontFamily: "Helvetica-Oblique", color: "#1A1A2E", textAlign: "center", lineHeight: 1.5 },
    statsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
    statCard: { flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: 12, border: "1 solid #fff" },
    statLabel: { fontSize: 7, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.5, color: "#9898AA", marginBottom: 4 },
    statValue: { fontSize: 16, fontFamily: "Helvetica-Bold" },
    badge: { fontSize: 7, fontFamily: "Helvetica-Bold", textTransform: "uppercase", paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
    conceptCard: { backgroundColor: "#fff", borderRadius: 10, padding: 10, marginBottom: 8, border: "1 solid #fff" },
    conceptRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
    conceptName: { fontSize: 10, fontFamily: "Helvetica-Bold" },
    dotsRow: { flexDirection: "row", gap: 3 },
    dot: { width: 16, height: 6, borderRadius: 3 },
    conceptText: { fontSize: 8, color: "#4A4A68", lineHeight: 1.4 },
    growthArea: { backgroundColor: "#FEF3C7", borderRadius: 6, padding: 6, marginTop: 4, border: "0.5 solid #F59E0B" },
    growthText: { fontSize: 8, color: "#B45309" },
    darkCard: { backgroundColor: "#1A1A2E", borderRadius: 16, padding: 20, marginBottom: 20, textAlign: "center" },
    darkLabel: { fontSize: 7, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 2, color: "rgba(255,255,255,0.5)", marginBottom: 8 },
    darkText: { fontSize: 10, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 },
    darkBadge: { backgroundColor: "rgba(255,255,255,0.1)", border: "0.5 solid rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, fontSize: 8, fontFamily: "Helvetica-Bold", color: "#fff", marginTop: 8, alignSelf: "center" },
    blindCard: { borderRadius: 10, padding: 10, marginBottom: 8, border: "0.5 solid #F59E0B" },
    blindTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 3 },
    blindText: { fontSize: 8, lineHeight: 1.4, marginBottom: 4 },
    correctBox: { backgroundColor: "rgba(255,255,255,0.4)", borderRadius: 8, padding: 6, border: "0.5 solid rgba(255,255,255,0.5)" },
    correctLabel: { fontSize: 6, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1, opacity: 0.6, marginBottom: 2 },
    correctText: { fontSize: 8, fontFamily: "Helvetica-Bold" },
    footer: { textAlign: "center", fontSize: 8, color: "#9898AA", borderTop: "0.5 solid #E2DFD8", paddingTop: 12, marginTop: 12 },
    footerBold: { fontFamily: "Helvetica-Bold", color: "#1A1A2E" },
})

function getScoreColor(score: number) {
    if (score >= 80) return "#00695C"
    if (score >= 60) return "#3D30C4"
    if (score >= 40) return "#B45309"
    return "#C2410C"
}

function getScoreLabel(score: number) {
    if (score >= 80) return "Strong"
    if (score >= 60) return "Good"
    if (score >= 40) return "Developing"
    return "Early Stage"
}

interface Props {
    session: any
    report: any
    user: {
        firstName?: string | null
        lastName?: string | null
        emailAddress?: string | null
        imageUrl?: string | null
    } | null | undefined
}

export default function ReportPDF({ session, report, user }: Props) {
    const scoreColor = getScoreColor(report.overall_score)
    const userCount = session.messages.filter((m: any) => m.role === "user").length
    const coveredCount = Object.values(session.depthScores).filter((s: any) => s >= 3).length

    return (
        <Document>
            <Page size={[595.28, 841.89]} style={s.page}>
                {/* Header */}
                <View style={s.header}>
                    <View>
                        <Text style={s.brand}>Recall</Text>
                        <Text style={s.date}>Mastery Report · {new Date().toLocaleDateString()}</Text>
                    </View>
                    <View style={s.scoreBox}>
                        <Text>{report.overall_score}</Text>
                    </View>
                </View>

                {/* Score */}
                <Text style={s.sectionLabel}>Mastery Score</Text>
                <Text style={[s.scoreNum, { color: scoreColor }]}>{report.overall_score}</Text>
                <Text style={[s.scoreLabel, { color: scoreColor }]}>{getScoreLabel(report.overall_score)}</Text>

                {/* User Info */}
                {user && (
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, backgroundColor: "rgba(255,255,255,0.4)", borderRadius: 10, padding: 10, border: "0.5 solid rgba(255,255,255,0.6)" }}>
                        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#00897B", marginRight: 10, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ color: "#fff", fontSize: 14, fontFamily: "Helvetica-Bold" }}>
                                {user.firstName?.[0] || "?"}
                            </Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold" }}>
                                {user.firstName} {user.lastName}
                            </Text>
                            <Text style={{ fontSize: 8, color: "#4A4A68" }}>
                                {user.emailAddress}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Topic */}
                <Text style={s.sectionLabel}>Topic</Text>
                <Text style={s.topic}>{session.topic}</Text>

                {/* Opening Summary */}
                <View style={s.quoteCard}>
                    <Text style={s.quoteText}>"{report.opening_summary}"</Text>
                </View>

                {/* Stats */}
                <View style={s.statsRow}>
                    <View style={s.statCard}>
                        <Text style={s.statLabel}>Time Spent</Text>
                        <Text style={s.statValue}>{session.durationMinutes}m</Text>
                    </View>
                    <View style={s.statCard}>
                        <Text style={s.statLabel}>Explanations</Text>
                        <Text style={s.statValue}>{userCount}</Text>
                    </View>
                    <View style={session.pasteCount > 0 ? [s.statCard, { borderColor: "#F59E0B" }] : s.statCard}>
                        <Text style={s.statLabel}>Paste Events</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={s.statValue}>{session.pasteCount || 0}</Text>
                            <Text style={[s.badge, session.pasteCount > 0 ? { backgroundColor: "#FEF3C7", color: "#B45309" } : { backgroundColor: "#E8F8F4", color: "#00695C" }]}>
                                {session.pasteCount > 0 ? "Flagged" : "Clean"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Paste Note */}
                {report?.paste_behavior?.note && (
                    <View style={{ backgroundColor: "#FEF3C7", borderRadius: 8, padding: 8, marginBottom: 16, border: "0.5 solid #F59E0B" }}>
                        <Text style={{ fontSize: 8, color: "#B45309" }}>{report.paste_behavior.note}</Text>
                    </View>
                )}

                {/* Knowledge Coverage */}
                <Text style={s.sectionLabel}>Knowledge Coverage</Text>
                <Text style={{ fontSize: 9, color: "#4A4A68", lineHeight: 1.5, marginBottom: 16 }}>
                    You covered {coveredCount} of {session.conceptTree.length} core concepts at an adequate depth.
                    {report.overall_score >= 80 ? " Exceptional mastery demonstrated." :
                        report.overall_score >= 60 ? " Solid grasp with room for deeper coverage." :
                            " Focus on strengthening foundational concepts."}
                </Text>

                {/* Concepts */}
                <Text style={s.sectionLabel}>Concept Breakdown</Text>
                {session.conceptTree.map((concept: any) => {
                    const score = session.depthScores[concept.id] || 0
                    const notes = report.concept_notes?.[concept.id] || { what_was_covered: "Covered.", what_was_missed: null }
                    return (
                        <View key={concept.id} style={s.conceptCard}>
                            <View style={s.conceptRow}>
                                <Text style={s.conceptName}>{concept.name}</Text>
                                <View style={s.dotsRow}>
                                    {[1, 2, 3, 4, 5].map(step => (
                                        <View key={step} style={[s.dot, { backgroundColor: step <= score ? "#00897B" : "#E2DFD8" }]} />
                                    ))}
                                </View>
                            </View>
                            <Text style={s.conceptText}>{notes.what_was_covered}</Text>
                            {notes.what_was_missed && (
                                <View style={s.growthArea}>
                                    <Text style={s.growthText}>Growth Area: {notes.what_was_missed}</Text>
                                </View>
                            )}
                        </View>
                    )
                })}

                {/* Best Moment */}
                {report.best_moment_note && (
                    <View style={s.darkCard}>
                        <Text style={s.darkLabel}>Best Moment</Text>
                        <Text style={s.darkText}>{report.best_moment_note}</Text>
                        {report.standout_stat && <Text style={s.darkBadge}>{report.standout_stat}</Text>}
                    </View>
                )}

                {/* Blind Spots */}
                {session.blindSpots && session.blindSpots.length > 0 && (
                    <>
                        <Text style={s.sectionLabel}>Blind Spots</Text>
                        {session.blindSpots.map((spot: any, idx: number) => (
                            <View key={idx} style={[s.blindCard, spot.type === "caught" ? { backgroundColor: "#E8F8F4", borderColor: "#00897B" } : { backgroundColor: "#FEF3C7", borderColor: "#F59E0B" }]}>
                                <Text style={[s.blindTitle, { color: spot.type === "caught" ? "#00695C" : "#B45309" }]}>
                                    {spot.type === "caught" ? "Confusion Clarified" : "Uncorrected Misconception"}
                                </Text>
                                <Text style={[s.blindText, { color: spot.type === "caught" ? "#00695C" : "#B45309" }]}>
                                    {spot.type === "caught"
                                        ? `Mia was confused about ${spot.wrong_belief}, but you steered her right.`
                                        : `Mia expressed: "${spot.wrong_belief}". Address this next time.`}
                                </Text>
                                <View style={s.correctBox}>
                                    <Text style={s.correctLabel}>Correct Insight</Text>
                                    <Text style={s.correctText}>{spot.correct_belief}</Text>
                                </View>
                            </View>
                        ))}
                    </>
                )}

                {/* Footer */}
                <Text style={s.footer}>
                    Powered by <Text style={s.footerBold}>Recall</Text> · Verified Mastery Report
                </Text>
            </Page>
        </Document>
    )
}
