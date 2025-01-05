import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueBookName1736073633595 implements MigrationInterface {
    name = 'UniqueBookName1736073633595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "UQ_233978864a48c44d3fcafe01573" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "UQ_233978864a48c44d3fcafe01573"`);
    }

}
