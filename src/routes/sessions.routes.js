import express from "express";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// Get a session
router.get("/", async (req, res) => {
  try {
    const userId = req.dbUser.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const [sessions, total] = await Promise.all([
      prisma.workoutSession.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      orderBy: {
        completedAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        template: true,
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
    }),
    prisma.workoutSession.count({
        where: {
          userId,
          status: "COMPLETED",
        },
      }),
    ]);

    const formatted = sessions.map((session) => {
      const records = 20;
      const durationSeconds = 
        session.startedAt && session.completedAt
          ? Math.floor(
              (session.completedAt.getTime() -
                session.startedAt.getTime()) /
                1000
            )
          : 0

          const hours = Math.floor(durationSeconds / 3600);
          const minutes = Math.floor((durationSeconds % 3600)/60);

        const duration =
          hours > 0
            ? `${hours}hr ${minutes.toString().padStart(2, "0")}min`
            : `${minutes}min`;

      let totalVolume = 0;

      const exercises = session.exercises.map((ex) => {
        ex.sets.forEach((set) => {
          totalVolume += set.weight * set.reps;
        });

        return {
          name: ex.exercise.name,
          sets: ex.sets.length,
        };
      });

      const formattedDate = session.completedAt
  ? new Date(session.completedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  : "";

      return {
        id: session.id,
        title: session.title || session.template?.title || "Workout",
        completedAt: formattedDate,
        duration,
        totalVolume,
        exercises,
        records,
      };
    });

    

    res.json({
      sessions:  formatted,
      page,
      hasMore: page * limit < total,
    });
    // console.log("Old exercises: ", formatted);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// Start a session
router.post("/start", async (req, res) => {
  try {
    const userId = req.dbUser.id;
    // const { templateId } = req.body;
    const templateId = req.body?.templateId || null;

    console.log("BODY", req.body);

    // Check if there's already an active session
    const existingSession = await prisma.workoutSession.findFirst({
      where: {
        userId,
        status: "IN_PROGRESS",
      },
    });

    if (existingSession) {
      return res.json(existingSession);
    }

    // Create new session
    const session = await prisma.workoutSession.create({
      data: {
        userId,
        templateId: templateId || null,
        startedAt: new Date(),
        status: "IN_PROGRESS",
      },
    });

    res.status(201).json(session);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to start session",
    });
  }
});

// Complete a session
router.post("/:id/complete", async (req, res) => {
  const userId = req.dbUser.id;
  const sessionId = req.params.id;
  const { endNote, exercises, title } = req.body;

  if (!Array.isArray(exercises) || exercises.length === 0) {
    return res.status(400).json({
      error: "Exercises array required",
    });
  }

  try {
    await prisma.$transaction(async (tx) => {

      // Validate session
      const session = await tx.workoutSession.findFirst({
        where: {
          id: sessionId,
          userId,
        },
      });

      if (!session) {
        throw new Error("Session not found");
      }

      if (session.status !== "IN_PROGRESS") {
        throw new Error("Session already completed");
      }

      // Process exercises
      for (let i = 0; i < exercises.length; i++) {
        const ex = exercises[i];

        if (!Array.isArray(ex.sets) || ex.sets.length === 0) {
          throw new Error("Each exercise must include sets");
        }

        const sessionExercise = await tx.sessionExercise.create({
          data: {
            sessionId,
            exerciseId: ex.exerciseId,
            orderIndex: i + 1,
          },
        });

        let exerciseVolume = 0;
        let exerciseMaxWeight = 0;
        let exerciseBest1RM = 0;

        for (let j = 0; j < ex.sets.length; j++) {
          if (j >= 10) {
            throw new Error("Max 10 sets per exercise");
          }

          const set = ex.sets[j];

          if (set.weight <= 0 || set.reps <= 0) {
            throw new Error("Invalid set values");
          }

          const volume = set.weight * set.reps;

          const estimated1RM =
            set.reps === 1
              ? set.weight
              : set.weight * (1 + set.reps / 30);

          exerciseVolume += volume;
          exerciseMaxWeight = Math.max(exerciseMaxWeight, set.weight);
          exerciseBest1RM = Math.max(exerciseBest1RM, estimated1RM);

          await tx.set.create({
            data: {
              sessionExerciseId: sessionExercise.id,
              setNumber: j + 1,
              weight: set.weight,
              reps: set.reps,
            },
          });
        }

        // Update metrics ONCE per exercise
        const existingMetric = await tx.exerciseMetric.findUnique({
          where: {
            userId_exerciseId: {
              userId: session.userId,
              exerciseId: ex.exerciseId,
            },
          },
        });

        if (!existingMetric) {
          await tx.exerciseMetric.create({
            data: {
              userId: session.userId,
              exerciseId: ex.exerciseId,
              totalVolume: exerciseVolume,
              maxWeight: exerciseMaxWeight,
              best1RM: exerciseBest1RM,
              lastUpdated: new Date(),
            },
          });
        } else {
          await tx.exerciseMetric.update({
            where: {
              userId_exerciseId: {
                userId: session.userId,
                exerciseId: ex.exerciseId,
              },
            },
            data: {
              totalVolume: existingMetric.totalVolume + exerciseVolume,
              maxWeight: Math.max(existingMetric.maxWeight, exerciseMaxWeight),
              best1RM: Math.max(existingMetric.best1RM, exerciseBest1RM),
              lastUpdated: new Date(),
            },
          });
        }
      }

      // Finalize session
      await tx.workoutSession.update({
        where: { id: sessionId },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          endNote: endNote || null,
          title: title || "Workout",
        },
      });

    });

    return res.json({ message: "Session completed successfully" });

  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
});

// Delete session
router.delete("/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.dbUser.id;

    await prisma.workoutSession.delete({
      where: {
        id,
        userId
      }
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete workout" });
  }
});


export default router;
