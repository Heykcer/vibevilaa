/**
 * Environment variables are now strictly validated during Vite server startup (see vite.config.js).
 * This ensures any missing or invalid variables crash the terminal immediately.
 * We can safely export import.meta.env here for the client to use.
 */
export const env = import.meta.env;
