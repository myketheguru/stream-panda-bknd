import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1646145022366 implements MigrationInterface {
    name = 'migration1646145022366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "name" varchar NOT NULL, "avatar" varchar NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" varchar(44) PRIMARY KEY NOT NULL, "user_id" integer, "content" text NOT NULL, "flash" text NOT NULL, "updated_at" integer NOT NULL, "created_at" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "applicant" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "interviewID" varchar NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "completedInterview" boolean NOT NULL, "startedAt" varchar NOT NULL, "endedAt" varchar NOT NULL, "category" varchar NOT NULL, "interviewerId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "video" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "link" varchar NOT NULL, "questionID" integer NOT NULL, "authorId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "question" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "category" varchar NOT NULL, "question" varchar NOT NULL, "authorId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "interview" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "interviewerID" integer NOT NULL, "completed" boolean NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_applicant" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "interviewID" varchar NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "completedInterview" boolean NOT NULL, "startedAt" varchar NOT NULL, "endedAt" varchar NOT NULL, "category" varchar NOT NULL, "interviewerId" integer NOT NULL, CONSTRAINT "FK_3013ff676a8118a3fbb4d6c4edf" FOREIGN KEY ("interviewerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_applicant"("id", "interviewID", "name", "email", "completedInterview", "startedAt", "endedAt", "category", "interviewerId") SELECT "id", "interviewID", "name", "email", "completedInterview", "startedAt", "endedAt", "category", "interviewerId" FROM "applicant"`);
        await queryRunner.query(`DROP TABLE "applicant"`);
        await queryRunner.query(`ALTER TABLE "temporary_applicant" RENAME TO "applicant"`);
        await queryRunner.query(`CREATE TABLE "temporary_video" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "link" varchar NOT NULL, "questionID" integer NOT NULL, "authorId" integer NOT NULL, CONSTRAINT "FK_66bcd4be37895e84dfa19c5a812" FOREIGN KEY ("authorId") REFERENCES "applicant" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_video"("id", "link", "questionID", "authorId") SELECT "id", "link", "questionID", "authorId" FROM "video"`);
        await queryRunner.query(`DROP TABLE "video"`);
        await queryRunner.query(`ALTER TABLE "temporary_video" RENAME TO "video"`);
        await queryRunner.query(`CREATE TABLE "temporary_question" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "category" varchar NOT NULL, "question" varchar NOT NULL, "authorId" integer NOT NULL, CONSTRAINT "FK_75fc761f2752712276be38e7d13" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_question"("id", "category", "question", "authorId") SELECT "id", "category", "question", "authorId" FROM "question"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`ALTER TABLE "temporary_question" RENAME TO "question"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" RENAME TO "temporary_question"`);
        await queryRunner.query(`CREATE TABLE "question" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "category" varchar NOT NULL, "question" varchar NOT NULL, "authorId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "question"("id", "category", "question", "authorId") SELECT "id", "category", "question", "authorId" FROM "temporary_question"`);
        await queryRunner.query(`DROP TABLE "temporary_question"`);
        await queryRunner.query(`ALTER TABLE "video" RENAME TO "temporary_video"`);
        await queryRunner.query(`CREATE TABLE "video" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "link" varchar NOT NULL, "questionID" integer NOT NULL, "authorId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "video"("id", "link", "questionID", "authorId") SELECT "id", "link", "questionID", "authorId" FROM "temporary_video"`);
        await queryRunner.query(`DROP TABLE "temporary_video"`);
        await queryRunner.query(`ALTER TABLE "applicant" RENAME TO "temporary_applicant"`);
        await queryRunner.query(`CREATE TABLE "applicant" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "interviewID" varchar NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "completedInterview" boolean NOT NULL, "startedAt" varchar NOT NULL, "endedAt" varchar NOT NULL, "category" varchar NOT NULL, "interviewerId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "applicant"("id", "interviewID", "name", "email", "completedInterview", "startedAt", "endedAt", "category", "interviewerId") SELECT "id", "interviewID", "name", "email", "completedInterview", "startedAt", "endedAt", "category", "interviewerId" FROM "temporary_applicant"`);
        await queryRunner.query(`DROP TABLE "temporary_applicant"`);
        await queryRunner.query(`DROP TABLE "interview"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "video"`);
        await queryRunner.query(`DROP TABLE "applicant"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
