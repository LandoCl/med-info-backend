import dotenv from "dotenv";
import { z } from "zod";
import path from "path";

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "Supabase Service Role Key is required"),
  JWT_SECRET: z.string().min(1, "JWT Secret is required"),
});

// Mapear variables alternativas para soportar configuraciones previas
const rawEnv = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY:
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  JWT_SECRET:
    process.env.JWT_SECRET || "dev_jwt_secret_key_change_me_in_production",
};

const parseEnv = () => {
  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    console.error("Error de validación en variables de entorno:");
    console.error(JSON.stringify(result.error.format, null, 2));
    process.exit(1);
  }

  return result.data;
};

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;
