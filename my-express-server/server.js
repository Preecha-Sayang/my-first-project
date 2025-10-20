// server.mjs (หรือ server.js ถ้าใช้ CommonJS)
import express from "express";
import cors from "cors";
import authRouter from "./apps/auth.mjs";
import postRouter from "./apps/postRouter.mjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

// ✅ Restrict CORS for security (Allow Frontend only)
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
  })
);

app.use(express.json());

// ✅ Example: Check Supabase keys loaded
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.warn("⚠️ Warning: Supabase credentials are missing in .env or Render Environment Variables");
}

// ✅ Route modules
app.use("/auth", authRouter); // /auth/login, /auth/register etc.
app.use("/posts", postRouter);

app.get("/", (req, res) => {
  res.send("Backend is running via Render 🚀");
});

app.listen(port, () => {
  console.log(`✅ Server is running at port ${port}`);
});