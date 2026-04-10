import { requireAuth } from "./middleware/requireAuth.js";
import { syncUser } from "./middleware/syncUser.js";
import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import templateRoutes from './routes/templates.routes.js';
import sessionRoutes from "./routes/sessions.routes.js";
import workoutRoutes from './routes/workout.routes.js';
import exerciseRoutes from './routes/exercise.routes.js';
import profileRoutes from  './routes/profile.routes.js';
import { globalLimiter } from "./middleware/rateLimiter.js";

const allowedOrigins = [
  "https://lifting-app-six.vercel.app",
];

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.options("*", cors());

app.use(express.json());

// Unprotected routes
app.use("/health", healthRoutes);
app.use('/exercises', exerciseRoutes);

// Auth
// app.use(requireAuth);
// app.use(syncUser);

// Rate limit
app.use(globalLimiter);

app.use("/workout", requireAuth, syncUser, workoutRoutes);
app.use("/sessions", requireAuth, syncUser, sessionRoutes);
app.use("/templates", requireAuth, syncUser, templateRoutes);
app.use("/profile", requireAuth, syncUser, profileRoutes);


export default app;
