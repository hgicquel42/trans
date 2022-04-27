/*
  Warnings:

  - The primary key for the `History` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "History" DROP CONSTRAINT "History_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "History_pkey" PRIMARY KEY ("id");
