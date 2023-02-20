-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "appName" VARCHAR(50) NOT NULL,
    "companyName" VARCHAR(50) NOT NULL,
    "companyAddress" VARCHAR(255) NOT NULL,
    "companyContactNumber" VARCHAR(15) NOT NULL,
    "companyEmailAddress" VARCHAR(255) NOT NULL,
    "logoPath" VARCHAR(255) NOT NULL,
    "faviconPath" VARCHAR(255) NOT NULL,
    "headerPath" VARCHAR(255) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_appName_key" ON "Application"("appName");

-- CreateIndex
CREATE UNIQUE INDEX "Application_companyName_key" ON "Application"("companyName");

-- CreateIndex
CREATE UNIQUE INDEX "Application_companyAddress_key" ON "Application"("companyAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Application_companyContactNumber_key" ON "Application"("companyContactNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Application_companyEmailAddress_key" ON "Application"("companyEmailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Application_logoPath_key" ON "Application"("logoPath");

-- CreateIndex
CREATE UNIQUE INDEX "Application_faviconPath_key" ON "Application"("faviconPath");

-- CreateIndex
CREATE UNIQUE INDEX "Application_headerPath_key" ON "Application"("headerPath");
