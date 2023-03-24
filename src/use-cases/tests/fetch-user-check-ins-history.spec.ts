import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { beforeEach, describe, it, expect } from 'vitest';
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe('Fetch User check-in history Use Case', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);

	});

	it('should be able to fetch checki-in history', async () => {
		await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		});

		await checkInsRepository.create({
			gym_id: 'gym-02',
			user_id: 'user-01'
		});

		await checkInsRepository.create({
			gym_id: 'gym-02',
			user_id: 'user-02'
		});

		const { checkIns } = await sut.execute({
			userId: 'user-01',
			page: 1
		});


		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: 'gym-01' }),
			expect.objectContaining({ gym_id: 'gym-02' })
		]);

	});

	it('should be able to fetch paginated checki-in history', async () => {

		for (let i = 0; i < 22  ; i++) {
			await checkInsRepository.create({
				gym_id: `gym-${i + 1}`,
				user_id: 'user-01'
			});
		}

		await checkInsRepository.create({
			gym_id: 'gym-02',
			user_id: 'user-02'
		});

		const { checkIns } = await sut.execute({
			userId: 'user-01',
			page: 2
		});


		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: 'gym-21' }),
			expect.objectContaining({ gym_id: 'gym-22' })
		]);
	});
});
