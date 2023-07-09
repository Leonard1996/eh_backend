import {MigrationInterface, QueryRunner} from "typeorm";

export class editControls1688902855216 implements MigrationInterface {
    name = 'editControls1688902855216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`diplomas\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`diplomas\` DROP COLUMN \`document\``);
        await queryRunner.query(`ALTER TABLE \`diplomas\` DROP COLUMN \`from\``);
        await queryRunner.query(`ALTER TABLE \`diplomas\` DROP COLUMN \`to\``);
        await queryRunner.query(`ALTER TABLE \`controls\` ADD \`title\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`controls\` ADD \`document\` varchar(256) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`controls\` ADD \`from\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`controls\` ADD \`to\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`controls\` DROP COLUMN \`to\``);
        await queryRunner.query(`ALTER TABLE \`controls\` DROP COLUMN \`from\``);
        await queryRunner.query(`ALTER TABLE \`controls\` DROP COLUMN \`document\``);
        await queryRunner.query(`ALTER TABLE \`controls\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`diplomas\` ADD \`to\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`diplomas\` ADD \`from\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`diplomas\` ADD \`document\` varchar(256) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`diplomas\` ADD \`title\` text NOT NULL`);
    }

}
