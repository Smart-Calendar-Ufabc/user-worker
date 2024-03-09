/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `password_recovery` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "password_recovery_token_key" ON "password_recovery"("token");
