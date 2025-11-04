-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UsersOnProject" (
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "projectId")
);
INSERT INTO "new_UsersOnProject" ("projectId", "userId") SELECT "projectId", "userId" FROM "UsersOnProject";
DROP TABLE "UsersOnProject";
ALTER TABLE "new_UsersOnProject" RENAME TO "UsersOnProject";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
