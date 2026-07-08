import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import snippets from './routes/snippets';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/snippets', snippets);

const port = process.env.PORT || 4001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`CodeVault Sprint-2 API listening on http://localhost:${port}`);
});
