/*
  Warnings:

  - Added the required column `originVideoName` to the `Highlight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Highlight" ADD COLUMN     "originVideoName" VARCHAR(100) NOT NULL;
