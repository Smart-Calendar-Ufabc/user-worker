/*
  Warnings:

  - Added the required column `token` to the `password_recovery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "password_recovery" ADD COLUMN     "token" TEXT NOT NULL;
