import http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimitPkg from "express-rate-limit";

import { env, assertEnv } from "./config/env.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import gigRoutes from "./routes/gigRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import { notFound, errorHandler } from "./middleware/error.js";

const rateLimit = rateLimitPkg;

/* ✅ Validate env + connect DB */
assertEnv();
await connectDB(env.MONGODB_URI);

/* ✅ Create app FIRST */
const app = express();

/* ✅ Create server ONCE */
const server = http.createServer(app);

/* ✅ Middlewares */
app.use(helmet());
app.use(
  cors({
    origin: [env.CLIENT_ORIGIN, "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

/* ✅ Routes */
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);

/* ✅ Errors */
app.use(notFound);
app.use(errorHandler);

/* ✅ Start server */
server.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});
