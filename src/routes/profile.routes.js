import express from "express";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// Get routine for user
router.get("/", async (req, res) => {
  try {
    const userId = req.dbUser.id;

    // Get all completed sessions
    const sessions = await prisma.workoutSession.findMany({
        where: {
            userId,
            status: "COMPLETED",
        },
        include: {
            exercises: {
                include: {
                    sets: true,
                },
            },
        },
        orderBy: {
            completedAt: "desc",
        },
    });

    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < sessions.length; i++) {
        const sessionDate = new Date(sessions[i].completedAt);

        const diffDays = Math.floor(
            (currentDate - sessionDate) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === i) {
            streak++;
        } else {
            break;
        }
    }

    let totalVolume = 0;
    let totalReps = 0;
    let totalDurationSeconds = 0;
    

    sessions.forEach((session) => {
        // duration
        if (session.startedAt && session.completedAt) {
            totalDurationSeconds += 
            (new Date(session.completedAt) - new Date(session.startedAt)) / 1000;
        }

        session.exercises.forEach((exercise) => {
            exercise.sets.forEach((set) => {
                if (set.weight && set.reps) {
                    totalVolume += set.weight * set.reps;
                    totalReps += set.reps;
                }
            });
        });
    });

    const totalDurationHours = Math.floor(totalDurationSeconds / 3600);

    // Recent workouts (last 5)
    const recentWorkouts = sessions.slice(0,5).map((s) => ({
        id: s.id,
        date: s.completedAt,
    }));

    const avgVolume =
  sessions.length > 0 ? Math.round(totalVolume / sessions.length) : 0;

const avgDuration =
  sessions.length > 0
    ? Math.round(totalDurationSeconds / sessions.length / 60)
    : 0;

    const muscleCount = {};

sessions.forEach((session) => {
  session.exercises.forEach((ex) => {
    const group = ex.exercise?.muscleGroup;

    if (!group) return;

    muscleCount[group] = (muscleCount[group] || 0) + 1;
  });
});

const topMuscle = Object.entries(muscleCount).sort(
  (a, b) => b[1] - a[1]
)[0]?.[0] || null;

    res.json({
        workouts: sessions.length,
        totalVolume,
        totalReps,
        totalDurationSeconds,
        totalDurationHours,
        recentWorkouts,
        streak,
        avgVolume,
        avgDuration,
        topMuscle,
    });
    
  } catch (err) {
    console.error("Profile route error:", err);
    res.status(500).json({ error: "Failed to fetch profile data" });
  }
});

export default router;