import dotenv from 'dotenv';

dotenv.config();

function getEnvValue(name: string, fallback = ''): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4001),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: getEnvValue('DATABASE_URL'),
};
