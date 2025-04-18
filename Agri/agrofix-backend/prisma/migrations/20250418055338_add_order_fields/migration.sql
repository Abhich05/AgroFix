/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userDetails` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderToProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `buyer_contact` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyer_name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `delivery_address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `items` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `imageUrl` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToProduct" DROP CONSTRAINT "_OrderToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToProduct" DROP CONSTRAINT "_OrderToProduct_B_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "updatedAt",
DROP COLUMN "userDetails",
ADD COLUMN     "buyer_contact" TEXT NOT NULL,
ADD COLUMN     "buyer_name" TEXT NOT NULL,
ADD COLUMN     "delivery_address" TEXT NOT NULL,
ADD COLUMN     "items" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "stock" SET DEFAULT 0,
ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "imageUrl" SET DEFAULT '';

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_OrderToProduct";

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
