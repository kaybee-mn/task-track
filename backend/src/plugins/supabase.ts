
import { createClient } from '@supabase/supabase-js'
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.EXPO_PUBLIC_SUPABASE_KEY!)
export default supabase;