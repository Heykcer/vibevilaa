import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { z } from 'zod';

const noPlaceholder = (val) => {
  if (!val) return false;
  return !val.toLowerCase().includes('your_') && !val.toLowerCase().includes('_here');
};

const customString = (name) => 
  z.string({ required_error: `Missing environment variable: ${name}` })
   .min(1, `${name} is required`)
   .refine(noPlaceholder, { message: `${name} must not be a template placeholder (e.g. 'your_api_key_here')` });

const envSchema = z.object({
  VITE_FIREBASE_API_KEY: customString('VITE_FIREBASE_API_KEY'),
  VITE_FIREBASE_AUTH_DOMAIN: customString('VITE_FIREBASE_AUTH_DOMAIN'),
  VITE_FIREBASE_PROJECT_ID: customString('VITE_FIREBASE_PROJECT_ID'),
  VITE_FIREBASE_STORAGE_BUCKET: customString('VITE_FIREBASE_STORAGE_BUCKET'),
  VITE_FIREBASE_MESSAGING_SENDER_ID: customString('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  VITE_FIREBASE_APP_ID: customString('VITE_FIREBASE_APP_ID'),
  VITE_FIREBASE_MEASUREMENT_ID: z.string().optional(),
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  const _env = envSchema.safeParse(env);
  
  if (!_env.success) {
    console.error('\n❌ Invalid or missing frontend environment variables:\n');
    _env.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      const message = issue.message;
      console.error(`   - ${path}: ${message}`);
    });
    console.error('\n🛑 Vite startup halted. Check your .env file.\n');
    process.exit(1);
  }

  return {
    plugins: [react()],
  };
});
