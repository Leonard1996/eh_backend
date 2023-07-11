import {MigrationInterface, QueryRunner} from "typeorm";

export class configs1689092790903 implements MigrationInterface {
    name = 'configs1689092790903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`configs\` (\`ts_deleted\` tinyint(1) NOT NULL DEFAULT '0', \`id\` int NOT NULL AUTO_INCREMENT, \`ts_created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`ts_last_modified\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`rank\` int NOT NULL, \`from\` timestamp NOT NULL, \`to\` timestamp NOT NULL, \`studyProgram\` varchar(255) NOT NULL, INDEX \`IDX_900febbbe23e63a72cbbc6c795\` (\`ts_deleted\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_900febbbe23e63a72cbbc6c795\` ON \`configs\``);
        await queryRunner.query(`DROP TABLE \`configs\``);
    }

}
