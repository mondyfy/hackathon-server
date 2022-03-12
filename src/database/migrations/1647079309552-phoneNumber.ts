import {MigrationInterface, QueryRunner} from "typeorm";

export class phoneNumber1647079309552 implements MigrationInterface {
    name = 'phoneNumber1647079309552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone_number" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_number"`);
    }

}
