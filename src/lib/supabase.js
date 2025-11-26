import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR: Faltan las variables de entorno de Supabase');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Configurada' : '✗ No configurada');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Configurada' : '✗ No configurada');
  console.error('Por favor, configura las variables de entorno en Vercel:');
  console.error('1. Ve a tu proyecto en Vercel');
  console.error('2. Settings → Environment Variables');
  console.error('3. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
  console.error('4. Redeploy el proyecto');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
