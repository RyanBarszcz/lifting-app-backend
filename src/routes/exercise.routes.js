import express from "express";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const exercises = await prisma.exercise.findMany({
      orderBy: { name: "asc" },
    });

    res.json(exercises);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
});

export default router;
