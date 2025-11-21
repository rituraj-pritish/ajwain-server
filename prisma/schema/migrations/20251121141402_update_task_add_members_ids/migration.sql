-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "membersIds" INTEGER[];

Update "Task"
Set "membersIds" = STRING_TO_ARRAY("memberIds", ',')::int[]
