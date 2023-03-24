import { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryGymsRpository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateGymUseCase } from '../create-gym';


let gymsRepository: GymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRpository();
		sut = new CreateGymUseCase(gymsRepository);
	});


	it('should be able to create a gym', async () => {
		const { gym } = await sut.execute({
			title: 'JS Gym',
			description: null,
			latitude: -21.9937656,
			longitude: -47.8893207,
			phone: null
		});

		expect(gym.id).toEqual(expect.any(String));
	});
});