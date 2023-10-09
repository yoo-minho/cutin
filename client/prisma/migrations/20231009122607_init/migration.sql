/*
  Warnings:

  - The primary key for the `Highlight` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Highlight" DROP CONSTRAINT "Highlight_pkey",
ALTER COLUMN "seekTime" SET DATA TYPE VARCHAR(7),
ADD CONSTRAINT "Highlight_pkey" PRIMARY KEY ("videoName", "seekTime");
