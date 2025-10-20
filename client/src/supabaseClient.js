import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Singleton instance
let supabaseInstance = null;
let currentToken = null;

// ฟังก์ชันสร้าง Supabase client ที่มี JWT token (Singleton Pattern)
export const getSupabase = () => {
  const token = localStorage.getItem("token");
  
  // ถ้า token เปลี่ยน หรือยังไม่มี instance ให้สร้างใหม่
  if (!supabaseInstance || currentToken !== token) {
    currentToken = token;
    
    if (token) {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    } else {
      // ถ้าไม่มี token ใช้ client ปกติ
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    }
  }
  
  return supabaseInstance;
};

// Export แบบเดิม (backward compatibility)
// ใช้ getSupabase() เพื่อให้ใช้ instance เดียวกัน
export const supabase = getSupabase();