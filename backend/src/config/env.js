import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables early
dotenv.config();

// Define the environment schema
const noPlaceholder = (val) => {
  if (!val) return false;
  return !val.toLowerCase().includes('your_') && !val.toLowerCase().includes('_here');
};

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z
    .string({ required_error: 'PORT environment variable is missing' })
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'PORT must be a valid positive integer',
    }),
  MONGO_URI: z
    .string({ required_error: 'MONGO_URI environment variable is missing' })
    .url({ message: 'MONGO_URI must be a valid connection string' })
    .refine(noPlaceholder, {
      message: "MONGO_URI must not be a template placeholder (e.g. 'your_mongo_uri')",
    }),
});

// Validate the process.env object
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('\n❌ Invalid or missing backend environment variables:\n');
  _env.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    const message = issue.message;
    console.error(`   - ${path}: ${message}`);
  });
  console.error('\n🛑 Server startup halted due to environment configuration errors.\n');
  process.exit(1);
}

// Display validated env in the terminal
console.log('\n✅ Environment Variables Validated:');
Object.keys(_env.data).forEach((key) => {
  console.log(`   - ${key} (Loaded)`);
});
console.log('');

// Export the validated environment variables
export const env = _env.data;
