import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Защита от запуска без ключей (причина зависания на скриншоте 17.16.29)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Критическая ошибка: Переменные окружения Supabase не найдены. ' +
    'Проверь настройки в панели Vercel (Settings -> Environment Variables).'
  );
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);

export type Profile = {
  id: string;
  username: string | null;
  full_name: string;
  avatar_url: string;
  role: 'sales' | 'tech' | 'admin';
  bio: string;
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  is_demo_slot: boolean;
  is_booked: boolean;
  booked_by_name: string;
  booked_by_email: string;
  color: string;
  created_at: string;
  profiles?: Profile;
};

export type FeedPost = {
  id: string;
  user_id: string;
  content: string;
  category: 'tech' | 'motivation' | 'life';
  charge_count: number;
  created_at: string;
  profiles?: Profile;
};

export type PostCharge = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};
