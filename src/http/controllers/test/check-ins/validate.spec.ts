import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// eslint-disable-next-line
describe('Validate Check-in (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to validate a check-in', async () => {
		const { token } = await createAndAuthenticateUser(app, true);
        
		const user = await prisma.user.findFirstOrThrow();

		const gym = await prisma.gym.create({
			data: {
				title: 'JS Gym',
				latitude: -21.9937656,
				longitude: -47.8893207,
			}
		});

		let checkIn = await prisma.checkIn.create({
			data: {
				gym_id: gym.id,
				user_id: user.id
			}
		});

		const response = await request(app.server)
			.patch(`/check-ins/${checkIn.id}/validate`)
			.set('Authorization', `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.checkIn.id).toEqual(checkIn.id);
        
		checkIn = await prisma.checkIn.findFirstOrThrow({
			where: {
				id: checkIn.id
			}
		});

		expect(checkIn.validated_at).toEqual(expect.any(Date));
	});
});