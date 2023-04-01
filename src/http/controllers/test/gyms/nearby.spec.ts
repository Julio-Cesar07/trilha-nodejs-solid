import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// eslint-disable-next-line
describe('Nearby Gyms (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to list nearby gyms', async () => {
		const { token } = await createAndAuthenticateUser(app);

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Near Gym',
				description: 'Some description',
				phone: '11999999999',
				latitude: -21.9937656,
				longitude: -47.8893207,
			});

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Near Gym 2',
				description: 'Some description',
				phone: '11999999999',
				latitude: -21.9922626,
				longitude: -47.8913992,
			});

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Far Gym',
				description: 'Some description',
				phone: '11999999999',
				latitude: -21.1829715,
				longitude: -48.7968464,
			});
            
		const response = await request(app.server)
			.get('/gyms/nearby')
			.query({
				latitude: -21.9937656,
				longitude: -47.8893207,
			})
			.set('Authorization', `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.gyms).toHaveLength(2);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'Near Gym'
			}),
			expect.objectContaining({
				title: 'Near Gym 2'
			}),
		]);
	});
});