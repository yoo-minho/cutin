/*
  Warnings:

  - The primary key for the `Highlight` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Highlight` table. All the data in the column will be lost.
  - Made the column `videoName` on table `Highlight` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Highlight" DROP CONSTRAINT "Highlight_pkey",
DROP COLUMN "id",
ALTER COLUMN "videoName" SET NOT NULL,
ADD CONSTRAINT "Highlight_pkey" PRIMARY KEY ("videoName", "seekTime");
