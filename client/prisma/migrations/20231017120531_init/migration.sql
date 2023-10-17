/*
  Warnings:

  - The primary key for the `GamePlayer` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "GamePlayer" DROP CONSTRAINT "GamePlayer_pkey",
ALTER COLUMN "teamName" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "player" SET DATA TYPE VARCHAR(6),
ADD CONSTRAINT "GamePlayer_pkey" PRIMARY KEY ("clubCode", "playDate", "player");
