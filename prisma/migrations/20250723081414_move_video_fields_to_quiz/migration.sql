/*
  Warnings:

  - You are about to drop the column `videoDuration` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `videoStart` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "videoDuration",
DROP COLUMN "videoStart",
DROP COLUMN "videoUrl";

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "videoDuration" INTEGER,
ADD COLUMN     "videoStart" INTEGER,
ADD COLUMN     "videoUrl" TEXT;
