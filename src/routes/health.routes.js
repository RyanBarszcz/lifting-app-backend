import express from "express";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userCount = await prisma.user.count();

    res.json({
      status: "OK",
      dbConnected: true,
      userCount,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      dbConnected: false,
      error: error.message,
    });
  }
});

export default router;
