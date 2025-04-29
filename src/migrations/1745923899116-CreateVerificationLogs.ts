import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVerificationLogs1745923899116 implements MigrationInterface {
    name = 'CreateVerificationLogs1745923899116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "verification_logs" ("id" SERIAL NOT NULL, "website_domain" character varying(255) NOT NULL, "status" character varying(50) NOT NULL, "certificate_id" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d353f16b3180c814a5975175a04" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "verification_logs"`);
    }

}
