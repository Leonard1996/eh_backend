import {MigrationInterface, QueryRunner} from "typeorm";

export class editDiploma1689069950885 implements MigrationInterface {
    name = 'editDiploma1689069950885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`diplomas\` ADD \`type\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`diplomas\` DROP COLUMN \`type\``);
    }

}
