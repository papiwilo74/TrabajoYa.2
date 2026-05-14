// backend/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { JobRepository } from './src/infrastructure/repositories/JobRepository.js';
import { ApplicationRepository } from './src/infrastructure/repositories/ApplicationRepository.js';
import { CreateJob } from './src/application/use-cases/CreateJob.js';
import { GetJobs } from './src/application/use-cases/GetJobs.js';
import { GetJobById } from './src/application/use-cases/GetJobById.js';
import { CreateApplication } from './src/application/use-cases/CreateApplication.js';
import { JobController } from './src/infrastructure/http/JobController.js';

const app = express();

// ── CORS: solo acepta el origen del frontend ──
const allowedOrigins = [
  process.env.FRONTEND_URL,         // http://localhost:5173 en dev
  'https://trabajoya.vercel.app',    // ← cambia por tu dominio real en Vercel
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permite peticiones sin origin (Postman, Railway health checks)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado para: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ── Inyección de dependencias ──
const jobRepository = new JobRepository();
const applicationRepository = new ApplicationRepository();

const createJobUseCase = new CreateJob(jobRepository);
const getJobsUseCase = new GetJobs(jobRepository);
const getJobByIdUseCase = new GetJobById(jobRepository);
const createApplicationUseCase = new CreateApplication(applicationRepository, jobRepository);

const jobController = new JobController(
  createJobUseCase,
  getJobsUseCase,
  getJobByIdUseCase,
  createApplicationUseCase
);

// ── Rutas ──
app.get('/api/jobs',          (req, res) => jobController.getJobs(req, res));
app.post('/api/jobs',         (req, res) => jobController.createJob(req, res));
app.get('/api/jobs/:id',      (req, res) => jobController.getJobById(req, res));
app.post('/api/applications', (req, res) => jobController.createApplication(req, res));

// Health check para Railway
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── 404 genérico ──
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
