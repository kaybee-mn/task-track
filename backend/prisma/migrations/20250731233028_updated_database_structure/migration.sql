-- CreateEnum
CREATE TYPE "RecurrenceType" AS ENUM ('DAILY', 'MONTHLY', 'WEEKLY', 'HOURLY', 'MINUTELY', 'YEARLY', 'BYMONTHDAY');

-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('task', 'mood', 'app_update');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "supabaseId" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "recurrence" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurrenceInfo" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "type" "RecurrenceType" NOT NULL,
    "freq" INTEGER NOT NULL,
    "fromLastCompletion" BOOLEAN NOT NULL,
    "byDay" TEXT[],
    "endOnDate" BOOLEAN NOT NULL,
    "end" INTEGER,
    "bySetPos" INTEGER,

    CONSTRAINT "RecurrenceInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SortingInfo" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "SortingInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mood" (
    "id" TEXT NOT NULL,
    "mood" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Mood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "type" "LogType" NOT NULL,
    "itemId" TEXT,
    "moodId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "range0" INTEGER NOT NULL,
    "range1" INTEGER NOT NULL,
    "textSize" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RecurrenceInfo_taskId_key" ON "RecurrenceInfo"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "SortingInfo_taskId_key" ON "SortingInfo"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurrenceInfo" ADD CONSTRAINT "RecurrenceInfo_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SortingInfo" ADD CONSTRAINT "SortingInfo_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mood" ADD CONSTRAINT "Mood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_moodId_fkey" FOREIGN KEY ("moodId") REFERENCES "Mood"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
