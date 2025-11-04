/*
  Warnings:

  - You are about to drop the column `members` on the `Task` table. All the data in the column will be lost.
  - Added the required column `memberIds` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "memberIds" TEXT NOT NULL
);
INSERT INTO "new_Task" ("createdAt", "createdByUserId", "date", "description", "id", "title") SELECT "createdAt", "createdByUserId", "date", "description", "id", "title" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
