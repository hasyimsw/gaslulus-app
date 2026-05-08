import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

// Parse DATABASE_URL: mysql://user:pass@host:port/db
function parseDatabaseUrl(url) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port) || 3306,
    user: parsed.username,
    password: parsed.password || undefined,
    database: parsed.pathname.replace('/', ''),
    connectionLimit: 5,
  };
}

const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb(dbConfig);
const prisma = new PrismaClient({ adapter });

export default prisma;
