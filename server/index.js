import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import programRoutes from './routes/programRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;


export const prisma = new PrismaClient();

// Routes
app.use('/api/programs', programRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'HealthTrack API is running' });
  });
  