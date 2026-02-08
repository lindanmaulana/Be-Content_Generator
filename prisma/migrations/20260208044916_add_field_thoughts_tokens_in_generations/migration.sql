/*
  Warnings:

  - Added the required column `thoughts_tokens` to the `generations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "generations" ADD COLUMN     "thoughts_tokens" INTEGER NOT NULL;
