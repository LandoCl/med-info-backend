import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

// Crear el cliente de Supabase utilizando la Service Role Key para omitir RLS en el backend
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);
