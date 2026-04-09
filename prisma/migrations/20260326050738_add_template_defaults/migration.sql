-- AlterTable
ALTER TABLE "TemplateExercise" ADD COLUMN     "defaultReps" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "defaultSets" INTEGER NOT NULL DEFAULT 1;
