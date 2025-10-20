// server.mjs (หรือ server.js ถ้าใช้ CommonJS)
import express from "express";
import cors from "cors";
import authRouter from "./apps/auth.mjs";
import postRouter from "./apps/postRouter.mjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

// ✅ Restrict CORS (อนุญาตเฉพาะ Frontend)
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
  })
);

app.use(express.json());

// ✅ Check Environment Variables
if (
  !process.env.SUPABASE_URL ||
  !process.env.SUPABASE_ANON_KEY ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.warn("⚠️ Warning: Supabase credentials are missing in .env or Render Environment Variables");
} else {
  console.log("✅ Supabase Environment Variables Loaded Successfully");
}

// ✅ Routes
app.use("/auth", authRouter);
app.use("/posts", postRouter);

// Root test
app.get("/", (req, res) => {
  res.send("Backend is running via Render 🚀");
});

app.listen(port, () => {
  console.log(`✅ Server is running at port ${port}`);
});