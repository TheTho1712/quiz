/*
  Warnings:

  - You are about to drop the column `videoDuration` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `videoStart` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "videoDuration" INTEGER,
ADD COLUMN     "videoStart" INTEGER,
ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "videoDuration",
DROP COLUMN "videoStart",
DROP COLUMN "videoUrl";
