/*
  Warnings:

  - You are about to alter the column `title` on the `Incident` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `area` on the `Incident` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "Incident" ALTER COLUMN "title" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "area" SET DATA TYPE VARCHAR(50);
