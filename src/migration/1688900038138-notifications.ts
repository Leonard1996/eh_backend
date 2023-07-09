import {MigrationInterface, QueryRunner} from "typeorm";

export class notifications1688900038138 implements MigrationInterface {
    name = 'notifications1688900038138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notifications\` (\`ts_deleted\` tinyint(1) NOT NULL DEFAULT '0', \`id\` int NOT NULL AUTO_INCREMENT, \`ts_created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`ts_last_modified\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`meta\` text NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_4ab265b821cfb5c075db47eb80\` (\`ts_deleted\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`diplomas\` DROP FOREIGN KEY \`FK_c8c6fc98c4f4bf480dc43e49a04\``);
        await queryRunner.query(`ALTER TABLE \`diplomas\` DROP FOREIGN KEY \`FK_73748a464b60427b62fa901be54\``);
        await queryRunner.query(`ALTER TABLE \`diplomas\` CHANGE \`studentId\` \`studentId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`diplomas\` CHANGE \`teacherId\` \`teacherId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`controls\` DROP FOREIGN KEY \`FK_5bd9583f3c20e1ff227bd55ff1b\``);
        await queryRunner.query(`ALTER TABLE \`controls\` CHANGE \`diplomaId\` \`diplomaId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_692a909ee0fa9383e7859f9b406\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`diplomas\` ADD CONSTRAINT \`FK_c8c6fc98c4f4bf480dc43e49a04\` FOREIGN KEY (\`studentId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`diplomas\` ADD CONSTRAINT \`FK_73748a464b60427b62fa901be54\` FOREIGN KEY (\`teacherId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`controls\` ADD CONSTRAINT \`FK_5bd9583f3c20e1ff227bd55ff1b\` FOREIGN KEY (\`diplomaId\`) REFERENCES \`diplomas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`controls\` DROP FOREIGN KEY \`FK_5bd9583f3c20e1ff227bd55ff1b\``);
        await queryRunner.query(`ALTER TABLE \`diplomas\` DROP FOREIGN KEY \`FK_73748a464b60427b62fa901be54\``);
        await queryRunner.query(`ALTER TABLE \`diplomas\` DROP FOREIGN KEY \`FK_c8c6fc98c4f4bf480dc43e49a04\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_692a909ee0fa9383e7859f9b406\``);
        await queryRunner.query(`ALTER TABLE \`controls\` CHANGE \`diplomaId\` \`diplomaId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`controls\` ADD CONSTRAINT \`FK_5bd9583f3c20e1ff227bd55ff1b\` FOREIGN KEY (\`diplomaId\`) REFERENCES \`diplomas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`diplomas\` CHANGE \`teacherId\` \`teacherId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`diplomas\` CHANGE \`studentId\` \`studentId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`diplomas\` ADD CONSTRAINT \`FK_73748a464b60427b62fa901be54\` FOREIGN KEY (\`teacherId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`diplomas\` ADD CONSTRAINT \`FK_c8c6fc98c4f4bf480dc43e49a04\` FOREIGN KEY (\`studentId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX \`IDX_4ab265b821cfb5c075db47eb80\` ON \`notifications\``);
        await queryRunner.query(`DROP TABLE \`notifications\``);
    }

}
