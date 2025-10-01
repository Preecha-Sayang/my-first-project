import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware ตรวจสอบ JWT token และดึง user_id
const protectUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // ดึง token จาก Authorization header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    // ใช้ Supabase ตรวจสอบ token และดึงข้อมูลผู้ใช้
    console.log("🔐 Token:", token);

const { data, error } = await supabase.auth.getUser(token);
console.log("🧑‍💼 User from token:", data?.user);

    if (error || !data.user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // แนบข้อมูลผู้ใช้เข้ากับ request object
    req.user = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata?.role || "user", // กำหนดค่า default เป็น "user"
    };

    // ดำเนินการต่อไปยัง middleware หรือ route handler ถัดไป
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectUser;