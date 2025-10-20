import express from "express";
import cors from "cors";
import authRouter from "./apps/auth.mjs";
import postRouter from "./apps/postRouter.mjs";

const app = express();
const port = process.env.PORT || 4001;


app.use(cors());
app.use(express.json());


app.use("/auth", authRouter);
app.use("/posts", postRouter);


app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});