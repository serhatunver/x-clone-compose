import { loadEnvFile } from 'node:process';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

const envPath = join(process.cwd(), `.env.test`);

if (existsSync(envPath)) {
  loadEnvFile(envPath);
} else {
  process.stderr.write(`.env file not found at: ${envPath}\n`);
}
