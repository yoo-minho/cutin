/*
  Warnings:

  - The primary key for the `Highlight` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Highlight" DROP CONSTRAINT "Highlight_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Highlight_pkey" PRIMARY KEY ("id");
