/*
  Warnings:

  - You are about to drop the column `onboardingCompleted` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "onboardingCompleted",
ADD COLUMN     "onboarding_completed" BOOLEAN NOT NULL DEFAULT false;
