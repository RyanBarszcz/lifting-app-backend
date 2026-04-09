import { prisma } from "../lib/prisma.js";

export async function syncUser(req, res, next) {
  try {
    // Test bypass
    if (process.env.NODE_ENV === "test") {
      console.log("Creating test user");
      const user = await prisma.user.upsert({
        where: { clerkId: "test-clerk-id" },
        update: {},
        create: { clerkId: "test-clerk-id" },
    });

    console.log("Yes user: ", user);

  req.dbUser = user;
  console.log("Yes user: ", user);
  return next();
}
    const clerkId = req.auth.userId;

    if (!clerkId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { clerkId },
      });
    }

    req.dbUser = user;

    next();
  } catch (error) {
    next(error);
  }
}