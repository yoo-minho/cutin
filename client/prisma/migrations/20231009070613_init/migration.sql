/*
  Warnings:

  - You are about to drop the column `originVideoName` on the `Highlight` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Highlight" DROP COLUMN "originVideoName",
ADD COLUMN     "videoName" VARCHAR(100);
