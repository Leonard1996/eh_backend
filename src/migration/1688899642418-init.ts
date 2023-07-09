import {MigrationInterface, QueryRunner} from "typeorm";

export class init1688899642418 implements MigrationInterface {
    name = 'init1688899642418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`ts_deleted\` tinyint(1) NOT NULL DEFAULT '0', \`id\` int NOT NULL AUTO_INCREMENT, \`ts_created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`ts_last_modified\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`name\` varchar(256) NOT NULL, \`email\` varchar(256) NOT NULL, \`unique_name\` varchar(256) NOT NULL, \`role\` varchar(256) NOT NULL DEFAULT 'student', INDEX \`IDX_69339ecb69244f31cf56243eba\` (\`ts_deleted\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`diplomas\` (\`ts_deleted\` tinyint(1) NOT NULL DEFAULT '0', \`id\` int NOT NULL AUTO_INCREMENT, \`ts_created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`ts_last_modified\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`title\` text NOT NULL, \`document\` varchar(256) NOT NULL, \`from\` int NOT NULL, \`to\` int NOT NULL, \`studentId\` int NULL, \`teacherId\` int NULL, INDEX \`IDX_f7a42c45a715c17721a573d3dd\` (\`ts_deleted\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`controls\` (\`ts_deleted\` tinyint(1) NOT NULL DEFAULT '0', \`id\` int NOT NULL AUTO_INCREMENT, \`ts_created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`ts_last_modified\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`status\` text NULL, \`sentDate\` timestamp NULL, \`order\` int NOT NULL, \`diplomaId\` int NULL, INDEX \`IDX_7d41e68f1d21b120d4316f466f\` (\`ts_deleted\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`diplomas\` ADD CONSTRAINT \`FK_c8c6fc98c4f4bf480dc43e49a04\` FOREIGN KEY (\`studentId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`diplomas\` ADD CONSTRAINT \`FK_73748a464b60427b62fa901be54\` FOREIGN KEY (\`teacherId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`controls\` ADD CONSTRAINT \`FK_5bd9583f3c20e1ff227bd55ff1b\` FOREIGN KEY (\`diplomaId\`) REFERENCES \`diplomas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`controls\` DROP FOREIGN KEY \`FK_5bd9583f3c20e1ff227bd55ff1b\``);
        await queryRunner.query(`ALTER TABLE \`diplomas\` DROP FOREIGN KEY \`FK_73748a464b60427b62fa901be54\``);
        await queryRunner.query(`ALTER TABLE \`diplomas\` DROP FOREIGN KEY \`FK_c8c6fc98c4f4bf480dc43e49a04\``);
        await queryRunner.query(`DROP INDEX \`IDX_7d41e68f1d21b120d4316f466f\` ON \`controls\``);
        await queryRunner.query(`DROP TABLE \`controls\``);
        await queryRunner.query(`DROP INDEX \`IDX_f7a42c45a715c17721a573d3dd\` ON \`diplomas\``);
        await queryRunner.query(`DROP TABLE \`diplomas\``);
        await queryRunner.query(`DROP INDEX \`IDX_69339ecb69244f31cf56243eba\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
