
import { createClient } from '@supabase/supabase-js';

// The user provided this URL.
const supabaseUrl = 'https://zwnancmpigtakxwtmmhk.supabase.co';

// IMPORTANT: You need to replace this with your Supabase public anon key.
// You can find this in your Supabase project's API settings.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bmFuY21waWd0YWt4d3RtbWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNjk3NjksImV4cCI6MjA3Mzc0NTc2OX0.4emAEEt2bpmhNAMVEGUOEzQpGcXA1jGJo_lBQ7tkYHk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);