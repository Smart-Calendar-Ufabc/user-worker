/*
  Warnings:

  - Added the required column `blockedTime_id` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "blockedTime_id" TEXT NOT NULL,
ALTER COLUMN "avatar_image_url" DROP NOT NULL;

-- CreateTable
CREATE TABLE "blocked_times" (
    "id" TEXT NOT NULL,
    "dates" TIMESTAMP(3)[],
    "weekDays" INTEGER[],
    "profile_id" TEXT NOT NULL,

    CONSTRAINT "blocked_times_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intervals" (
    "id" TEXT NOT NULL,
    "startHour" INTEGER NOT NULL,
    "startMinutes" INTEGER NOT NULL,
    "endHour" INTEGER NOT NULL,
    "endMinutes" INTEGER NOT NULL,
    "blockedTime_id" TEXT NOT NULL,

    CONSTRAINT "intervals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blocked_times" ADD CONSTRAINT "blocked_times_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervals" ADD CONSTRAINT "intervals_blockedTime_id_fkey" FOREIGN KEY ("blockedTime_id") REFERENCES "blocked_times"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
