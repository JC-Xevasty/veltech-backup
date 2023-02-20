-- CreateEnum
CREATE TYPE "User_Type" AS ENUM ('CLIENT', 'ACCOUNTING', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "User_Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Project_Type" AS ENUM ('INSTALLATION', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "Building_Type" AS ENUM ('COMMERCIAL', 'RESIDENTIAL');

-- CreateEnum
CREATE TYPE "Project_Features" AS ENUM ('FDAS', 'SPRINKLER');

-- CreateEnum
CREATE TYPE "Project_Quotation_Status" AS ENUM ('NOT_AVAILABLE', 'FOR_REVIEW', 'WAITING_OCULAR', 'DRAFTING', 'FOR_APPROVAL', 'FOR_REVISION', 'APPROVED');

-- CreateEnum
CREATE TYPE "Project_Status" AS ENUM ('NOT_AVAILABLE', 'WAITING_CONTRACT', 'WAITING_SIGNATURE', 'WAITING_PAYMENT', 'WAITING_APPROVAL', 'ONGOING', 'COMPLETED', 'ON_HOLD', 'TERMINATED');

-- CreateEnum
CREATE TYPE "Project_Payment_Status" AS ENUM ('NOT_AVAILABLE', 'WAITING_APPROVAL', 'WAITING_PAYMENT', 'PROGRESS_BILLING', 'FULLY_PAID');

-- CreateEnum
CREATE TYPE "Project_Milestone_Status" AS ENUM ('NOT_AVAILABLE', 'ONGOING', 'DONE');

-- CreateEnum
CREATE TYPE "Project_Purchase_Order_Status" AS ENUM ('NOT_AVAILABLE', 'FOR_APPROVAL', 'APPROVED', 'PO_SENT', 'PARTIALLY_PAID', 'FULLY_PAID');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "middleName" VARCHAR(50),
    "lastName" VARCHAR(50) NOT NULL,
    "suffix" VARCHAR(15),
    "username" VARCHAR(15) NOT NULL,
    "emailAddress" VARCHAR(320) NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifyToken" TEXT NOT NULL,
    "resetToken" TEXT,
    "type" "User_Type" NOT NULL DEFAULT 'SUPERADMIN',
    "status" "User_Status" NOT NULL DEFAULT 'ACTIVE',
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quotation" (
    "id" TEXT NOT NULL,
    "projectTitle" VARCHAR(255) NOT NULL,
    "projectType" "Project_Type" NOT NULL,
    "buildingType" "Building_Type" NOT NULL,
    "establishmentSize" DECIMAL(65,30) NOT NULL,
    "projectFeatures" "Project_Features"[],
    "floorPlan" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "quotationStatus" "Project_Quotation_Status" NOT NULL DEFAULT 'FOR_REVIEW',
    "materialsCost" MONEY,
    "laborCost" MONEY,
    "requirementsCost" MONEY,
    "quotation" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quotation_Log" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entry" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quotation_Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "contactPerson" VARCHAR(255) NOT NULL,
    "contactPersonPosition" VARCHAR(255) NOT NULL,
    "contactNumber" VARCHAR(255) NOT NULL,
    "emailAddress" VARCHAR(320) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "projectStatus" "Project_Status" NOT NULL DEFAULT 'NOT_AVAILABLE',
    "paymentStatus" "Project_Payment_Status" NOT NULL DEFAULT 'NOT_AVAILABLE',
    "quotationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project_Milestone" (
    "milestoneNo" INTEGER NOT NULL,
    "price" MONEY NOT NULL,
    "estimatedEnd" TIMESTAMP(3) NOT NULL,
    "milestoneStatus" "Project_Milestone_Status" NOT NULL,
    "paymentStatus" "Project_Payment_Status" NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_Milestone_pkey" PRIMARY KEY ("milestoneNo","projectId")
);

-- CreateTable
CREATE TABLE "Project_Log" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entry" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase_Order" (
    "id" TEXT NOT NULL,
    "poNo" INTEGER NOT NULL,
    "projectId" TEXT NOT NULL,
    "terms" TEXT[],
    "total" DECIMAL(65,30) NOT NULL,
    "deliverTo" VARCHAR(255) NOT NULL,
    "preparedById" TEXT NOT NULL,
    "approvedById" TEXT NOT NULL,
    "purchaseOrderstatus" "Project_Purchase_Order_Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase_Order_Item" (
    "id" TEXT NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "unitCost" MONEY NOT NULL,
    "quantity" INTEGER NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "entry" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supplierId" TEXT NOT NULL,

    CONSTRAINT "Purchase_Order_Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase_Order_Log" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entry" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_Order_Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailAddress_key" ON "User"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_verifyToken_key" ON "User"("verifyToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_image_key" ON "User"("image");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_projectTitle_key" ON "Quotation"("projectTitle");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_floorPlan_key" ON "Quotation"("floorPlan");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_quotation_key" ON "Quotation"("quotation");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_contactNumber_key" ON "Supplier"("contactNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_emailAddress_key" ON "Supplier"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_address_key" ON "Supplier"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Project_quotationId_key" ON "Project"("quotationId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation_Log" ADD CONSTRAINT "Quotation_Log_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation_Log" ADD CONSTRAINT "Quotation_Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project_Milestone" ADD CONSTRAINT "Project_Milestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project_Log" ADD CONSTRAINT "Project_Log_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project_Log" ADD CONSTRAINT "Project_Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase_Order" ADD CONSTRAINT "Purchase_Order_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase_Order" ADD CONSTRAINT "Purchase_Order_preparedById_fkey" FOREIGN KEY ("preparedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase_Order" ADD CONSTRAINT "Purchase_Order_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase_Order_Item" ADD CONSTRAINT "Purchase_Order_Item_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "Purchase_Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase_Order_Item" ADD CONSTRAINT "Purchase_Order_Item_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase_Order_Log" ADD CONSTRAINT "Purchase_Order_Log_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "Purchase_Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase_Order_Log" ADD CONSTRAINT "Purchase_Order_Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
