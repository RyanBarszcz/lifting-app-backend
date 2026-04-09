-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "WorkoutSession" ADD COLUMN     "status" "SessionStatus" NOT NULL DEFAULT 'IN_PROGRESS';
