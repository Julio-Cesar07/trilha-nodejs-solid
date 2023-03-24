import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { it, beforeEach, describe, expect } from 'vitest';
import { GetUserMetricsCheckInUseCase } from '../get-user-metrics';

let checkInsRepository: CheckInsRepository;
let sut: GetUserMetricsCheckInUseCase;

describe('Get User Metrics Use Case', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new GetUserMetricsCheckInUseCase(checkInsRepository);
	});

	it('should be able to get check-ins from metrics', async () => {
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

		const { count_checkIns } = await sut.execute({
			userId: 'user-01'
		});

		expect(count_checkIns).toEqual(2);
	});
});