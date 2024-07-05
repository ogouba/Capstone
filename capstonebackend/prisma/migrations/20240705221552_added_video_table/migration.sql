/*
  Warnings:

  - You are about to drop the column `videos` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "videos";

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "videoData" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
