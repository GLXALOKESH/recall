import express from 'express';
import cors from 'cors';
import webhookRoutes from './routes/webhook.routes.js';
import userRoutes from './routes/user.routes.js';
import sessionRoutes from './routes/session.routes.js';

const app = express();

// Webhook routes must be mounted before express.json() to preserve raw body for Svix verification
app.use('/api/webhooks', webhookRoutes);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Server is running 🚀' });
});

export default app;
