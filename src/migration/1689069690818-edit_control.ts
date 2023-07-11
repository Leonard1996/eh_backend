import {MigrationInterface, QueryRunner} from "typeorm";

export class editControl1689069690818 implements MigrationInterface {
    name = 'editControl1689069690818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`controls\` ADD \`originalDocument\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`controls\` ADD \`studyProgram\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`controls\` DROP COLUMN \`studyProgram\``);
        await queryRunner.query(`ALTER TABLE \`controls\` DROP COLUMN \`originalDocument\``);
    }

}
