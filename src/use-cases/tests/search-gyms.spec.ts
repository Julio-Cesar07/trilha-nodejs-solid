import { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryGymsRpository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { SearchGymsUseCase } from '../search-gyms';

let gymsRepository: GymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRpository();
		sut = new SearchGymsUseCase(gymsRepository);
	});

	it('should be able search gyms by name', async () => {
		await gymsRepository.create({
			title: 'JS Gym',
			description: null,
			latitude: -21.9937656,
			longitude: -47.8893207,
			phone: null
		});

		await gymsRepository.create({
			title: 'JS Gym 2',
			description: null,
			latitude: -21.9937656,
			longitude: -47.8893207,
			phone: null
		});

		await gymsRepository.create({
			title: 'Gym new',
			description: null,
			latitude: -21.9937656,
			longitude: -47.8893207,
			phone: null
		});

		// vai pesquisar academias que inclui a query no title
		const { gyms } = await sut.execute({query: 'JS', page: 1});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'JS Gym'}),
			expect.objectContaining({ title: 'JS Gym 2'})
		]);
	});

	it('should be able to fetch paginated gym search', async () => {
		for(let i = 0; i < 22; i++){
			await gymsRepository.create({
				title: `JS Gym ${i+1}`,
				description: null,
				latitude: -21.9937656,
				longitude: -47.8893207,
				phone: null
			});
		}

		const { gyms } = await sut.execute({query: 'JS', page: 2});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'JS Gym 21'}),
			expect.objectContaining({ title: 'JS Gym 22'})
		]);
	});
});