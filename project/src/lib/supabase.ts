import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Если ключей нет, создаем "пустышку", чтобы приложение не крашилось при загрузке
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('🔴 КРИТИЧЕСКАЯ ОШИБКА: Ключи Supabase отсутствуют в Environment Variables!');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// ... (остальные типы Profile, Event и т.д. оставляем без изменений)
