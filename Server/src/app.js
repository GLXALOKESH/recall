import express from 'express';
import cors from 'cors';
import webhookRoutes from './routes/webhook.routes.js';
import userRoutes from './routes/user.routes.js';
import sessionRoutes from './routes/session.routes.js';
import { startSessionCleanupJob } from './jobs/sessionCleanup.js';

const app = express();

app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});

// Webhook routes must be mounted before express.json() to preserve raw body for Svix verification
app.use('/api/webhooks', webhookRoutes);

// Start background jobs
startSessionCleanupJob();

// Middlewares
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://192.168.0.4:3000', 'http://192.168.31.73:3000', 'http://192.168.31.73:3000'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
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
