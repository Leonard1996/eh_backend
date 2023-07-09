import {MigrationInterface, QueryRunner} from "typeorm";

export class changeOrdeRToRank1688904864596 implements MigrationInterface {
    name = 'changeOrdeRToRank1688904864596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`controls\` CHANGE \`order\` \`rank\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`controls\` CHANGE \`rank\` \`order\` int NOT NULL`);
    }

}
