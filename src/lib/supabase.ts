import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cavqtwxyzkikuokunjiu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhdnF0d3h5emtpa3Vva3Vuaml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NDc2NTgsImV4cCI6MjA5MTIyMzY1OH0.6WN4Er7CvMZFrfR6lA4Ww3z7RLerbejxMx97ppETmY4';


export const supabase = createClient(supabaseUrl, supabaseAnonKey);