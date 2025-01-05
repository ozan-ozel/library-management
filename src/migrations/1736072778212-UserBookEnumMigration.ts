import { MigrationInterface, QueryRunner } from "typeorm";

export class UserBookEnumMigration1736072778212 implements MigrationInterface {
    name = 'UserBookEnumMigration1736072778212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_book" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."user_book_status_enum" AS ENUM('BORROWED', 'RETURNED')`);
        await queryRunner.query(`ALTER TABLE "user_book" ADD "status" "public"."user_book_status_enum" NOT NULL DEFAULT 'BORROWED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_book" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."user_book_status_enum"`);
        await queryRunner.query(`ALTER TABLE "user_book" ADD "status" character varying(50) NOT NULL`);
    }

}
