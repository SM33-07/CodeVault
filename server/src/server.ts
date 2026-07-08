import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';

const port = env.port;

app.listen(port, () => {
  logger.info(`CodeVault Sprint-2 API listening on http://localhost:${port}`);
});
