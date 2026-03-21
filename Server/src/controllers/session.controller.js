import User from '../models/User.js';
import Session from '../models/Session.js';
import crypto from 'crypto';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import { call_llama_8b } from '../utils/groq.js';
import { call_flash } from '../utils/gemini.js';

export const createSession = async (req, res) => {
    try {
        const {
            id,           // Frontend's UUID
            user_id,      // Clerk User ID
            topic,
            status,
            start_time,
            concept_tree,
            messages,
            depth_scores,
            blind_spots,
        } = req.body;

        if (!id || !user_id || !topic) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: id, user_id, or topic',
            });
        }

        // Find user by their Clerk ID
        const user = await User.findOne({ clerkId: user_id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found in system',
            });
        }

        // Create the Session in MongoDB
        const newSession = await Session.create({
            sessionId: id,
            user: user._id,
            topic,
            status: status || 'initializing',
            startTime: start_time ? new Date(start_time) : new Date(),
            conceptTree: concept_tree || null,
            messages: messages || [],
            depthScores: depth_scores || {},
            blindSpots: blind_spots || [],
        });

        // Add this session to the user's history
        user.sessions.push(newSession._id);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Session created successfully',
            data: newSession,
        });

    } catch (error) {
        console.error('Error creating session:', error);

        // Handle duplicate key error if frontend sends same UUID again
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Session with this ID already exists',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while creating session',
            error: error.message,
        });
    }
};

export const initSession = async (req, res) => {
    try {
        const { topic, user_id } = req.body;
        const file = req.file;

        if (!topic || !user_id) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: topic or user_id',
            });
        }

        // 1. Handle File Upload -> source_text
        let source_text = null;
        if (file) {
            if (file.mimetype === 'application/pdf') {
                const data = await pdf(file.buffer);
                source_text = data.text;
            } else if (file.mimetype === 'text/plain') {
                source_text = file.buffer.toString('utf-8');
            } else {
                return res.status(400).json({ success: false, message: 'Invalid file type. Only PDF or TXT allowed.' });
            }
            // Chunk to ~3000 tokens (simplistic character slice = ~12000 chars)
            if (source_text.length > 12000) {
                source_text = source_text.substring(0, 12000);
            }
        }

        // 2. Safety Check via Llama 3.1 8B
        const safetyPrompt = `Check if the following text or topic is abusive, malicious, involves crime, or is meaningless gibberish (random typed letters). Return ONLY "true" if it is bad/abusive/gibberish, and "false" if it is safe.
Topic: ${topic}
${source_text ? `Text: ${source_text}` : ''}`;

        const safetyResponse = await call_llama_8b([{ role: "user", content: safetyPrompt }]);
        const isAbusive = safetyResponse?.choices?.[0]?.message?.content?.trim().toLowerCase();

        // Strict guard
        if (isAbusive === 'true' || isAbusive?.includes('true')) {
            return res.status(400).json({
                success: false,
                message: 'invalid input',
            });
        }

        // 3. User & DB Prep
        let user = await User.findOne({ clerkId: user_id });

        // Lazy-create user if missing (helpful if Clerk Webhook was missed locally)
        if (!user) {
            const { email, firstName, lastName, imageUrl } = req.body;
            if (!email) {
                return res.status(404).json({ success: false, message: 'User not found in DB and fallback email missing.' });
            }
            user = await User.create({
                clerkId: user_id,
                email,
                firstName: firstName || '',
                lastName: lastName || '',
                imageUrl: imageUrl || '',
                sessions: []
            });
        }

        // 4. Gemini Concept Tree Generation
        // DEVELOPMENT TOGGLE: Set to true to bypass Gemini and save your 20 req/day quota
        const USE_MOCK_GEMINI = true;
        let parsed;

        if (USE_MOCK_GEMINI) {
            console.log("Using Mock Gemini Response to save quota...");
            parsed = {
                topic: "How React Hooks Work",
                concepts: [
                    {
                        id: "c1",
                        name: "Stateful Logic in Functional Components",
                        description: "Hooks fundamentally allow functional components to manage state and side effects, which were previously exclusive to class components."
                    },
                    {
                        id: "c2",
                        name: "`useState` Mechanism and State Preservation",
                        description: "React preserves the state managed by `useState` across component re-renders by associating it with a specific hook call through a consistent internal order."
                    },
                    {
                        id: "c3",
                        name: "`useEffect` for Side Effect Synchronization",
                        description: "`useEffect` allows components to perform side effects after rendering, synchronize with external systems, and provides an optional cleanup mechanism."
                    },
                    {
                        id: "c4",
                        name: "Rules of Hooks and Call Order",
                        description: "The strict rules of Hooks (called only at the top level and only from React functions) are crucial for React to consistently track and map internal state and effects to each hook call during renders."
                    },
                    {
                        id: "c5",
                        name: "React's Internal Hook Queue",
                        description: "Internally, React maintains a linked list or array of 'hook states' for each component, where each hook's state (e.g., `useState`'s value, `useEffect`'s dependencies) is stored and retrieved based on call order."
                    },
                    {
                        id: "c6",
                        name: "Custom Hooks for Logic Reusability",
                        description: "Custom Hooks are JavaScript functions that encapsulate and reuse stateful logic by calling other built-in Hooks, enabling sharing of non-visual behavior across components without sharing state directly."
                    }
                ],
                misconception: {
                    concept_id: "c3",
                    wrong_belief: "Mia believes that `useEffect` with an empty dependency array `[]` behaves exactly like `componentDidMount` and its callback always sees the latest props and state.",
                    correct_belief: "While `useEffect` with `[]` runs once after the initial render and its cleanup on unmount, the effect's callback 'closes over' the props and state from that initial render, meaning it won't reflect later changes unless those values are explicitly included in the dependency array."
                }
            };
        } else {
            const geminiSystemPrompt = `You are a curriculum designer. When given a topic, return a JSON object with exactly 5 to 8 sub-concepts a person must understand to demonstrate genuine mastery of that topic. Return ONLY valid JSON, no explanation, no markdown fences.`;

            const geminiUserPrompt = `Topic: ${topic}\n${source_text ? `Additional context from user's notes: ${source_text}` : ''}
    
Return this exact shape:
{
  "topic": "the topic name cleaned up",
  "concepts": [
    { "id": "c1", "name": "Concept Name", "description": "one sentence" }
  ],
  "misconception": {
    "concept_id": "c1",
    "wrong_belief": "what Mia will falsely claim",
    "correct_belief": "the truth"
  }
}`;
            const combinedPrompt = `${geminiSystemPrompt}\n\n${geminiUserPrompt}`;
            const treeResponseText = await call_flash(combinedPrompt);

            try {
                const cleanedResponse = treeResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
                parsed = JSON.parse(cleanedResponse);
            } catch (e) {
                console.error("Failed to parse Gemini JSON:", e, treeResponseText);
                parsed = fallback(topic);
            }
        }

        // 6. DB Finalization
        const sessionId = crypto.randomUUID();
        const depth_scores = Object.fromEntries(parsed.concepts.map((c) => [c.id, 0]));

        const newSession = await Session.create({
            sessionId,
            user: user._id,
            topic: parsed.topic || topic,
            status: 'active',
            startTime: new Date(),
            conceptTree: parsed.concepts,
            misconception: parsed.misconception,
            depthScores: depth_scores,
            sourceText: source_text,
            messages: [],
            blindSpots: []
        });

        user.sessions.push(newSession._id);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Session initialized successfully',
            data: newSession,
        });

    } catch (error) {
        console.error("Error in initSession:", error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

function fallback(topic) {
    return {
        topic: topic,
        concepts: [
            { id: "c1", name: "Core Definition", description: "Learn the core definition of the underlying concepts." },
            { id: "c2", name: "Key Components", description: "Understand the key components and how they fit together." },
            { id: "c3", name: "How It Works", description: "Master the mechanics of how it functions in reality." },
            { id: "c4", name: "Real-World Application", description: "Apply this knowledge to a practical real-world scenario." },
            { id: "c5", name: "Common Pitfalls", description: "Identify common mistakes and misconceptions." },
        ],
        misconception: null
    }
}

export const endSession = async (req, res) => {
    try {
        const { id } = req.params; // sessionId
        const session = await Session.findOne({ sessionId: id });
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }
        // Mark as completed
        session.status = 'completed';
        session.endTime = new Date();
        await session.save();
        return res.status(200).json({ success: true, message: 'Session ended successfully', data: session });
    } catch (error) {
        console.error('Error ending session:', error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const deleteSession = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await Session.findOne({ sessionId: id });
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }
        await User.updateOne(
            { _id: session.user },
            { $pull: { sessions: session._id } }
        );
        await Session.deleteOne({ _id: session._id });
        res.status(200).json({ success: true, message: 'Session deleted' });
    } catch (error) {
        console.error("Error deleting session:", error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


export const getSession = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await Session.findOne({ sessionId: id });
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }
        res.status(200).json({ success: true, data: session });
    } catch (error) {
        console.error("Error fetching session:", error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
