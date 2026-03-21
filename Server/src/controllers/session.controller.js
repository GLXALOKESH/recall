import User from '../models/User.js';
import Session from '../models/Session.js';

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
