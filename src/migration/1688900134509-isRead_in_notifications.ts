import {MigrationInterface, QueryRunner} from "typeorm";

export class isReadInNotifications1688900134509 implements MigrationInterface {
    name = 'isReadInNotifications1688900134509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`isRead\` tinyint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`isRead\``);
    }

}
