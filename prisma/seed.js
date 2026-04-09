import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const exercises = [
    // Bench Day
    {
      name: "Bench Press",
      description: "Barbell bench press",
      muscleGroup: "Chest",
      category: "Compound",
    },
    {
      name: "Incline Dumbbell Press",
      description: "Incline dumbbell press",
      muscleGroup: "Chest",
      category: "Compound",
    },
    {
      name: "Seated Shoulder Dumbbell Press",
      description: "Seated dumbbell shoulder press",
      muscleGroup: "Shoulders",
      category: "Compound",
    },
    {
      name: "Chest Fly (Machine)",
      description: "Machine chest fly",
      muscleGroup: "Chest",
      category: "Isolation",
    },
    {
      name: "Lateral Raise (Cable)",
      description: "Cable lateral raise",
      muscleGroup: "Shoulders",
      category: "Isolation",
    },
    {
      name: "Tricep Rope Pushdown",
      description: "Cable tricep rope pushdown",
      muscleGroup: "Triceps",
      category: "Isolation",
    },
    {
      name: "Overhead Tricep Extension",
      description: "Overhead tricep extension",
      muscleGroup: "Triceps",
      category: "Isolation",
    },

    // Back Day
    {
      name: "Lat Pulldown",
      description: "Wide grip lat pulldown",
      muscleGroup: "Back",
      category: "Compound",
    },
    {
      name: "Seated Row",
      description: "Seated cable row",
      muscleGroup: "Back",
      category: "Compound",
    },
    {
      name: "Back Extension",
      description: "Lower back extension",
      muscleGroup: "Lower Back",
      category: "Core",
    },
    {
      name: "Rear Delt Reverse Fly (Machine)",
      description: "Machine rear delt fly",
      muscleGroup: "Shoulders",
      category: "Isolation",
    },
    {
      name: "Reverse Fly Single Arm (Cable)",
      description: "Single arm cable reverse fly",
      muscleGroup: "Shoulders",
      category: "Isolation",
    },
    {
      name: "Preacher Curl (Machine)",
      description: "Machine preacher curl",
      muscleGroup: "Biceps",
      category: "Isolation",
    },
    {
      name: "Hammer Curl (Dumbbell)",
      description: "Dumbbell hammer curl",
      muscleGroup: "Biceps",
      category: "Isolation",
    },
    {
      name: "Seated Incline Curl (Dumbbell)",
      description: "Incline dumbbell curl",
      muscleGroup: "Biceps",
      category: "Isolation",
    },

    // Leg Day
    {
      name: "Hack Squat",
      description: "Machine hack squat",
      muscleGroup: "Legs",
      category: "Compound",
    },
    {
      name: "Seated Leg Curl (Machine)",
      description: "Machine hamstring curl",
      muscleGroup: "Legs",
      category: "Isolation",
    },
    {
      name: "Seated Calf Raise",
      description: "Seated calf raise machine",
      muscleGroup: "Calves",
      category: "Isolation",
    },
    {
      name: "Glute Kickback (Machine)",
      description: "Machine glute kickback",
      muscleGroup: "Glutes",
      category: "Isolation",
    },
    {
      name: "Hip Adduction (Machine)",
      description: "Machine hip adduction",
      muscleGroup: "Legs",
      category: "Isolation",
    },
    {
      name: "Hip Abduction (Machine)",
      description: "Machine hip abduction",
      muscleGroup: "Legs",
      category: "Isolation",
    },
    {
      name: "Cable Crunch",
      description: "Cable abdominal crunch",
      muscleGroup: "Core",
      category: "Core",
    },
    {
      name: "Oblique Twist (Cable)",
      description: "Cable oblique twist",
      muscleGroup: "Core",
      category: "Core",
    },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    });
  }

  console.log("Your workout exercises seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
