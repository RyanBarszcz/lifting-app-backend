import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      clerkId: "dev-user-1"
    }
  });

  console.log("Created user:", user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
