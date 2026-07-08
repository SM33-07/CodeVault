import express from 'express';
import cors from 'cors';
import snippetRoutes from './routes/snippet.routes';
import { errorHandler } from './middlewares/error.middleware';

export const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'CodeVault API is running. Use /api/health or /api/snippets.' });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/snippets', snippetRoutes);

app.use(errorHandler);
