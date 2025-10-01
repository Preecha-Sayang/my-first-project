import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import connectionPool from "../utils/db.mjs";
import multer from "multer";
import protectUser from "../middleware/protectUser.mjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const upload = multer({ storage: multer.memoryStorage() });
const authRouter = Router();

// จะเพิ่ม routes ต่างๆ ที่นี่
authRouter.post("/register", async (req, res) => {
  const { email, password, username, name } = req.body;

  try {
    // ตรวจสอบว่า username มีในฐานข้อมูลหรือไม่
    const usernameCheckQuery = `
                                SELECT * FROM users 
                                WHERE username = $1
                               `;
    const usernameCheckValues = [username];
    const { rows: existingUser } = await connectionPool.query(
      usernameCheckQuery,
      usernameCheckValues
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "This username is already taken" });
    }

    // สร้างผู้ใช้ใหม่ผ่าน Supabase Auth
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
    });

    // ตรวจสอบ error จาก Supabase
    if (supabaseError) {
      if (supabaseError.code === "user_already_exists") {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }
      // จัดการกับ error อื่นๆ จาก Supabase
      return res
        .status(400)
        .json({ error: "Failed to create user. Please try again." });
    }

    const supabaseUserId = data.user.id;

    // เพิ่มข้อมูลผู้ใช้ในฐานข้อมูล PostgreSQL
    const query = `
        INSERT INTO users (id, username, name, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

    const values = [supabaseUserId, username, name, "user"];

    const { rows } = await connectionPool.query(query, values);
    res.status(201).json({
      message: "User created successfully",
      user: rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // ตรวจสอบว่า error เกิดจากข้อมูลเข้าสู่ระบบไม่ถูกต้องหรือไม่
      if (
        error.code === "invalid_credentials" ||
        error.message.includes("Invalid login credentials")
      ) {
        return res.status(400).json({
          error: "Your password is incorrect or this email doesn't exist",
        });
      }
      return res.status(402).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Signed in successfully",
      access_token: data.session.access_token,
    });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred during login" });
  }
});

authRouter.get("/get-user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    // ดึงข้อมูลผู้ใช้จาก Supabase
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return res.status(401).json({ error: "Unauthorized or token expired" });
    }

    const supabaseUserId = data.user.id;
    const query = `
                    SELECT * FROM users 
                    WHERE id = $1
                  `;
    const values = [supabaseUserId];
    const { rows } = await connectionPool.query(query, values);

    res.status(200).json({
      id: data.user.id,
      email: data.user.email,
      username: rows[0].username,
      name: rows[0].name,
      role: rows[0].role,
      profilePic: rows[0].profile_pic,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

authRouter.put("/reset-password", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // ดึง token จาก Authorization header
  const { oldPassword, newPassword } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  if (!newPassword) {
    return res.status(400).json({ error: "New password is required" });
  }

  try {
    // ตั้งค่า session ด้วย token ที่ส่งมา
    const { data: userData, error: userError } = await supabase.auth.getUser(
      token
    );

    if (userError) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // ตรวจสอบรหัสผ่านเดิมโดยลองล็อกอิน
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: oldPassword,
      });

    if (loginError) {
      return res.status(400).json({ error: "Invalid old password" });
    }

    // อัปเดตรหัสผ่านของผู้ใช้
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      message: "Password updated successfully",
      user: data.user,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

authRouter.post("/upload-profile-pic", protectUser, upload.single("profilePic"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const userId = req.user.id;
    const fileBuffer = req.file.buffer;
    const fileName = `profile-pics/${userId}-${Date.now()}.png`;

    // ⬆️ Upload ไป Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("my-personal0blog")
      .upload(fileName, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload Error:", uploadError.message);
      return res.status(500).json({ error: uploadError.message });
    }

    // ⬇️ Get Public URL
    const { data: urlData } = supabase.storage
      .from("my-personal0blog")
      .getPublicUrl(fileName);

    const publicURL = urlData?.publicUrl;

    if (!publicURL) {
      return res.status(500).json({ error: "Failed to retrieve public URL" });
    }

    

    // ✅ Update DB
    const query = `UPDATE users SET profile_pic = $1 WHERE id = $2 RETURNING *`;
    const values = [publicURL, userId];
    const { rows } = await connectionPool.query(query, values);

    

    res.status(200).json({
      message: "Profile picture updated",
      profilePic: publicURL,
    });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

authRouter.put("/update-profile", protectUser, async (req, res) => {
  const userId = req.user.id; // ได้จาก middleware protectUser
  const { name, username } = req.body;

  if (!name || !username) {
    return res.status(400).json({ error: "Name and username are required" });
  }

  try {
    // ตรวจสอบว่ามี username ซ้ำกับคนอื่นหรือไม่ (ยกเว้นตัวเอง)
    const usernameCheckQuery = `
      SELECT * FROM users WHERE username = $1 AND id <> $2
    `;
    const { rows: existingUser } = await connectionPool.query(usernameCheckQuery, [username, userId]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "This username is already taken" });
    }

    // อัปเดตข้อมูล user ในฐานข้อมูล
    const updateQuery = `
      UPDATE users SET name = $1, username = $2 WHERE id = $3 RETURNING *
    `;
    const { rows } = await connectionPool.query(updateQuery, [name, username, userId]);

    res.status(200).json({ message: "Profile updated successfully", user: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


authRouter.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Sign in ผ่าน Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (
        error.code === "invalid_credentials" ||
        error.message.includes("Invalid login credentials")
      ) {
        return res.status(400).json({
          error: "Your password is incorrect or this email doesn't exist",
        });
      }
      return res.status(402).json({ error: error.message });
    }

    const user = data.user;
    const accessToken = data.session.access_token;

    // 2. Query role จาก PostgreSQL DB ผ่าน pool
    const result = await connectionPool.query(
      "SELECT role FROM users WHERE id = $1",
      [user.id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "User role not found" });
    }

    const isAdmin = result.rows[0].role === "admin";

    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied: Not an admin" });
    }

    // 3. ส่ง response กลับ
    return res.status(200).json({
      message: "Signed in successfully",
      access_token: accessToken,
      is_admin: isAdmin,
      user_id: user.id,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "An error occurred during login" });
  }
});


export default authRouter;
