import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1736043948639 implements MigrationInterface {
    name = 'InitialMigration1736043948639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "book" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "averageRating" double precision NOT NULL DEFAULT '0', "borrowCount" integer NOT NULL DEFAULT '0', "totalRating" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_book" ("id" SERIAL NOT NULL, "status" character varying(50) NOT NULL, "borrowDate" TIMESTAMP, "returnDate" TIMESTAMP, "rating" integer, "userId" integer, "bookId" integer, CONSTRAINT "PK_3fdacff8af7da81a1cab6bc9f17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_book" ADD CONSTRAINT "FK_ab47037d446ad35a3437ad77170" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_book" ADD CONSTRAINT "FK_82b430d61bfdb4e840329b48170" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_book" DROP CONSTRAINT "FK_82b430d61bfdb4e840329b48170"`);
        await queryRunner.query(`ALTER TABLE "user_book" DROP CONSTRAINT "FK_ab47037d446ad35a3437ad77170"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_book"`);
        await queryRunner.query(`DROP TABLE "book"`);
    }

}
