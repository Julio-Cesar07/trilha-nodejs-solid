import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// eslint-disable-next-line
describe('Create Check-in (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to create a check-in', async () => {
		const { token } = await createAndAuthenticateUser(app);
        
		const gym = await prisma.gym.create({
			data: {
				title: 'JS Gym',
				latitude: -21.9937656,
				longitude: -47.8893207,
			}
		});

		const response = await request(app.server)
			.post(`/gyms/${gym.id}/check-ins`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				latitude: -21.9937656,
				longitude: -47.8893207,
			});

		expect(response.statusCode).toEqual(201);
	});
});