-- DropForeignKey
ALTER TABLE "ai_requests" DROP CONSTRAINT "ai_requests_user_id_fkey";

-- AddForeignKey
ALTER TABLE "ai_requests" ADD CONSTRAINT "ai_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
