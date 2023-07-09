import {MigrationInterface, QueryRunner} from "typeorm";

export class addUniqueNumberUser1688928533220 implements MigrationInterface {
    name = 'addUniqueNumberUser1688928533220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`uniqueNumber\` varchar(256) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`uniqueNumber\``);
    }

}
