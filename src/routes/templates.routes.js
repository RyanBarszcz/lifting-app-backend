import express from "express";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// Get routine for user
router.get("/", async (req, res) => {
  try {
    const userId = req.dbUser.id;

    const routines = await prisma.workoutTemplate.findMany({
      where: { userId },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: {
              orderBy: {
                setNumber: "asc",
              },
            },
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
    });

    // format for frontend
    const formatted = routines.map((r) => ({
      id: r.id,
      title: r.name,
      exercises: r.exercises.map((e) => ({
        exerciseId: e.exerciseId,
        name: e.exercise.name,
        order: e.orderIndex,
        sets: e.sets.map((s) => ({
          setNumber: s.setNumber,
          reps: s.reps,
        })),
      })),
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch routines" });
  }
});

// Create workout routine
router.post("/create", async (req, res) => {
  try {
    const userId = req.dbUser.id;

    const { title, exercises } = req.body;

    if (!title || !Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({
        error: "Title and exercises are required",
      });
    }

    const template = await prisma.workoutTemplate.create({
      data: {
        userId,
        name: title,
        exercises: {
          create: exercises.map((ex, index) => ({
            exerciseId: ex.exerciseId,
            orderIndex: ex.orderIndex ?? index + 1,
            sets: {
              create: ex.sets.map((set, i) => ({
                setNumber: set.setNumber ?? i + 1,
                reps: set.reps,
              })),
            },
          })),
        },
      },
      include: {
        exercises: true,
      },
    });

    res.status(201).json(template);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create template" });
  }
});

// Delete workout template
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.dbUser.id;
    const { id } = req.params;

    const template = await prisma.workoutTemplate.findUnique({
      where: { id },
    });

    if (!template || template.userId !== userId) {
      return res.status(404).json({ error: "Template not found" });
    }

    await prisma.workoutTemplate.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete template" });
  }
});

export default router;
