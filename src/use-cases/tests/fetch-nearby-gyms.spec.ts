import { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryGymsRpository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FeatchNearbyGym } from '../fetch-nearby-gyms';

let gymsRepository: GymsRepository;
let sut: FeatchNearbyGym;

describe('Fetch Nearby Gyms Use Case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRpository();
		sut = new FeatchNearbyGym(gymsRepository);
	});

	it('should be able to featch nearby gyms', async () => {
		await gymsRepository.create({
			title: 'Near Gym',
			description: null,
			latitude: -21.9937656,
			longitude: -47.8893207,
			phone: null
		});

		await gymsRepository.create({
			title: 'Near Gym 2',
			description: null,
			latitude: -21.9922626,
			longitude: -47.8913992,
			phone: null
		});

		await gymsRepository.create({
			title: 'Far Gym',
			description: null,
			latitude: -21.1829715,
			longitude: -48.7968464,
			phone: null
		});

		// vai pesquisar academias que inclui a query no title
		const { gyms } = await sut.execute({
			userLatitude: -21.9788402,
			userLongitude: -47.880122
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'Near Gym'}),
			expect.objectContaining({ title: 'Near Gym 2'})
		]);
	});

});