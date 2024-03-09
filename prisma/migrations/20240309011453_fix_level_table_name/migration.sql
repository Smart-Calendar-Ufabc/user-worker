/*
  Warnings:

  - Changed the type of `level` on the `logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "level" AS ENUM ('Info', 'Warn', 'Error');

-- AlterTable
ALTER TABLE "logs" DROP COLUMN "level",
ADD COLUMN     "level" "level" NOT NULL;

-- DropEnum
DROP TYPE "Level";
