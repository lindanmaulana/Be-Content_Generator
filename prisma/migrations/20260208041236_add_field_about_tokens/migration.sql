/*
  Warnings:

  - Added the required column `completion_tokens` to the `generations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prompt_tokens` to the `generations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_tokens` to the `generations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "generations" ADD COLUMN     "completion_tokens" INTEGER NOT NULL,
ADD COLUMN     "prompt_tokens" INTEGER NOT NULL,
ADD COLUMN     "total_tokens" INTEGER NOT NULL,
ALTER COLUMN "prompt" SET DATA TYPE VARCHAR(200);
