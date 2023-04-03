import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// eslint-disable-next-line
describe('Search Gyms (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to search gyms by title', async () => {
		const { token } = await createAndAuthenticateUser(app, true);
		
		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'JS Gym',
				description: 'Some description',
				phone: '11999999999',
				latitude: -21.9937656,
				longitude: -47.8893207,
			});

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'TS Gym',
				description: 'Some description',
				phone: '11999999999',
				latitude: -21.9937656,
				longitude: -47.8893207,
			});

		const response = await request(app.server)
			.get('/gyms/search')
			.query({
				query: 'JS'
			})
			.set('Authorization', `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'JS Gym'
			})
		]);
	});
});