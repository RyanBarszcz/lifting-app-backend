/*
  Warnings:

  - You are about to drop the column `defaultReps` on the `TemplateExercise` table. All the data in the column will be lost.
  - You are about to drop the column `defaultSets` on the `TemplateExercise` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "TemplateExercise_templateId_idx";

-- AlterTable
ALTER TABLE "TemplateExercise" DROP COLUMN "defaultReps",
DROP COLUMN "defaultSets";

-- CreateTable
CREATE TABLE "TemplateSet" (
    "id" TEXT NOT NULL,
    "templateExerciseId" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,

    CONSTRAINT "TemplateSet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TemplateSet_templateExerciseId_idx" ON "TemplateSet"("templateExerciseId");

-- AddForeignKey
ALTER TABLE "TemplateSet" ADD CONSTRAINT "TemplateSet_templateExerciseId_fkey" FOREIGN KEY ("templateExerciseId") REFERENCES "TemplateExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
