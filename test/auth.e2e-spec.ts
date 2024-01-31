import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { startUp } from 'src/app.startup';
import { EntityManager, QueryRunner} from 'typeorm';


describe('Authentication System', () => {
    let app: INestApplication;
    let entityManager: EntityManager;
    let queryRunner: QueryRunner;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        startUp(app);
        await app.init();

        entityManager = moduleFixture.get(EntityManager);
        await entityManager.transaction(async transactionalEntityManager => {
            queryRunner = transactionalEntityManager.queryRunner;
            await queryRunner.startTransaction();
        });
    });

    afterEach(async () => {
        if (queryRunner && !queryRunner.isReleased) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
        }
    });

    it ('should handle a user register', async () => {
        const email = "attempt4@gmail.com";
        const user = {
            fullName: "trev trev2",
            username: "attempt4",
            email,
            password: "trev",
            gender: "Other"
        }

        console.log(user);

        await request(app.getHttpServer())
            .post('/auth/register')
            .send(user)
            .expect(201)
            .then((res) => {
                const {access_token} = res.body;
                expect(access_token).toBeDefined();
            })
    })
})
