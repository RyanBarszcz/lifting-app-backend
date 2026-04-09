import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const exercises = [
    {
      id: "e73a1424-89d3-4a82-89c8-a371eca20a70",
      name: "Bench Press",
      description: "Barbell bench press",
      muscleGroup: "Chest",
      category: "Compound",
    },
    {
      id: "dd2f13f5-2d09-4c64-bc5e-b5b38c1f7a12",
      name: "Incline Dumbbell Press",
      description: "Incline dumbbell press",
      muscleGroup: "Chest",
      category: "Compound",
    },
    {
      id: "9977962f-d0c6-4fc9-a51d-4512ba1ecf88",
      name: "Seated Shoulder Dumbbell Press",
      description: "Seated dumbbell shoulder press",
      muscleGroup: "Shoulders",
      category: "Compound",
    },
    {
      id: "75d3850d-2e90-4841-9f2e-4faafd786cab",
      name: "Chest Fly (Machine)",
      description: "Machine chest fly",
      muscleGroup: "Chest",
      category: "Isolation",
    },
    {
      id: "6994753b-f595-4263-8014-e7e23a6de8f2",
      name: "Lateral Raise (Cable)",
      description: "Cable lateral raise",
      muscleGroup: "Shoulders",
      category: "Isolation",
    },
    {
      id: "237bc7c7-ec63-486d-8748-f36ddc324979",
      name: "Tricep Rope Pushdown",
      description: "Cable tricep rope pushdown",
      muscleGroup: "Triceps",
      category: "Isolation",
    },
    {
      id: "11e2ca68-c629-497c-9d4d-1d266907a0ca",
      name: "Overhead Tricep Extension",
      description: "Overhead tricep extension",
      muscleGroup: "Triceps",
      category: "Isolation",
    },
    {
      id: "ad6736a1-129c-4688-9467-4147866d9389",
      name: "Lat Pulldown",
      description: "Wide grip lat pulldown",
      muscleGroup: "Back",
      category: "Compound",
    },
    {
      id: "59301130-5fee-4053-81de-17e7a429973b",
      name: "Seated Row",
      description: "Seated cable row",
      muscleGroup: "Back",
      category: "Compound",
    },
    {
      id: "4ce09db5-5d95-45d7-9a51-c9a51028caa8",
      name: "Back Extension",
      description: "Lower back extension",
      muscleGroup: "Lower Back",
      category: "Core",
    },
    {
      id: "9989178f-4ce1-4527-952c-2c5b940d67d3",
      name: "Rear Delt Reverse Fly (Machine)",
      description: "Machine rear delt fly",
      muscleGroup: "Shoulders",
      category: "Isolation",
    },
    {
      id: "a7197127-53ee-4691-9b8b-5bb6b5018b06",
      name: "Reverse Fly Single Arm (Cable)",
      description: "Single arm cable reverse fly",
      muscleGroup: "Shoulders",
      category: "Isolation",
    },
    {
      id: "234f1274-5184-40e0-85c6-031509a690b6",
      name: "Preacher Curl (Machine)",
      description: "Machine preacher curl",
      muscleGroup: "Biceps",
      category: "Isolation",
    },
    {
      id: "bd27f005-dccd-468f-bf3c-460221ffca12",
      name: "Hammer Curl (Dumbbell)",
      description: "Dumbbell hammer curl",
      muscleGroup: "Biceps",
      category: "Isolation",
    },
    {
      id: "85f34c3d-64d1-430d-a626-7cebe75a3b50",
      name: "Seated Incline Curl (Dumbbell)",
      description: "Incline dumbbell curl",
      muscleGroup: "Biceps",
      category: "Isolation",
    },
    {
      id: "c2af8948-7909-4a7d-95f9-bcc2debbb752",
      name: "Hack Squat",
      description: "Machine hack squat",
      muscleGroup: "Legs",
      category: "Compound",
    },
    {
      id: "f394cf54-f19b-4821-8a33-b81a24364a0f",
      name: "Seated Leg Curl (Machine)",
      description: "Machine hamstring curl",
      muscleGroup: "Legs",
      category: "Isolation",
    },
    {
      id: "63ece281-c75f-497d-beaa-d2037710532a",
      name: "Seated Calf Raise",
      description: "Seated calf raise machine",
      muscleGroup: "Calves",
      category: "Isolation",
    },
    {
      id: "d91e265c-fd83-407d-903f-5dff9d83397a",
      name: "Glute Kickback (Machine)",
      description: "Machine glute kickback",
      muscleGroup: "Glutes",
      category: "Isolation",
    },
    {
      id: "43ed09ec-6f66-4aa4-83f2-a140396cec26",
      name: "Hip Adduction (Machine)",
      description: "Machine hip adduction",
      muscleGroup: "Legs",
      category: "Isolation",
    },
    {
      id: "81ec3b08-5993-4f02-9901-bab134c871a4",
      name: "Hip Abduction (Machine)",
      description: "Machine hip abduction",
      muscleGroup: "Legs",
      category: "Isolation",
    },
    {
      id: "f08d86d6-27a2-4c34-a191-7aabd6c1692d",
      name: "Cable Crunch",
      description: "Cable abdominal crunch",
      muscleGroup: "Core",
      category: "Core",
    },
    {
      id: "e8addde9-ca18-4277-945b-62989f5e4b2f",
      name: "Oblique Twist (Cable)",
      description: "Cable oblique twist",
      muscleGroup: "Core",
      category: "Core",
    },
  ];

  for (const ex of exercises) {
    await prisma.exercise.upsert({
      where: { id: ex.id },
      update: {},
      create: ex,
    });
  }

  console.log("✅ Exercises seeded");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());