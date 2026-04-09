import express from "express";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

/**
 * GET /workout/previous
 * exerciseIds=id1,id2,id3
 */
router.get("/previous", async (req, res) => {
  try {
    // use DB user
    const userId = req.dbUser.id;
    // console.log("UserID: ", userId);
    const { exerciseIds } = req.query;

    if (!exerciseIds) {
      return res.json({});
    }

    const ids = exerciseIds.split(",");

    const result = {};

    for (const exerciseId of ids) {
      const sessionExercise = await prisma.sessionExercise.findFirst({
        where: {
          exerciseId: exerciseId,
          session: {
            is: {
              userId: userId,
              status: "COMPLETED",
            },
          },
        },
        orderBy: {
          session: {
            completedAt: "desc",
          },
        },
        include: {
          sets: {
            orderBy: {
              setNumber: "asc",
            },
          },
        },
      });

      if (sessionExercise) {
        result[exerciseId] = sessionExercise.sets.map((set) => ({
          setNumber: set.setNumber,
          weight: set.weight,
          reps: set.reps,
        }));
      } else {
        result[exerciseId] = [];
      }
    }

    // console.log("Previous workout data: ", result);
    return res.json(result);

  } catch (error) {
    console.error("Error fetching previous workout:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Doing id:", id);

    const session = await prisma.workoutSession.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json({ error: "Workout not found" });
    }

    // duration
    const duration =
      session.startedAt && session.completedAt
        ? Math.floor(
            (session.completedAt.getTime() - session.startedAt.getTime()) / 60000
          )
        : 0;
      
    // formatted date
    const formattedDate = session.completedAt
  ? new Date(session.completedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  : "";

    let totalSets = 0;
    let volume = 0;

    const exercises = session.exercises.map((entry) => {
      const sets = entry.sets.map((set) => {
        totalSets++;

        const weight = set.weight || 0;
        const reps = set.reps || 0;

        volume += weight * reps;

        return {
          weight,
          reps
        };
      });

      return {
        id: entry.id,
        exerciseId: entry.exerciseId,
        name: entry.exercise.name,
        sets
      };
    });

    res.json({
      id: session.id,
      title: session.title || "Workout",
      duration,
      volume,
      totalSets,
      muscleSplit: [], // we can compute later
      exercises,
      formattedDate
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id} = req.params;

    await prisma.workoutSession.delete({
      where: {id}
    });

    res.json({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Failed to delete workout"});
  }
})

router.get("/me", async (req, res) => {
  try {
    res.json({
      message: "User synced successfully",
      dbUser: req.dbUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});


export default router;
