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

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use('/exercises', exerciseRoutes);

app.use("/workout", requireAuth, syncUser, workoutRoutes);
app.use("/sessions", requireAuth, syncUser, sessionRoutes);
app.use("/templates", requireAuth, syncUser, templateRoutes);
app.use("/profile", requireAuth, syncUser, profileRoutes);


export default app;
