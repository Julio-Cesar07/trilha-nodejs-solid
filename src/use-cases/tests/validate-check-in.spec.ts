import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { maximunCheckInValidationTime } from '@/utils/maximun-check-in-validation-time';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { LateCheckInValidationError } from '../errors/late-check-in-validation-error';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { CheckInValidateUseCase } from '../validate-check-in';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInValidateUseCase;

describe('Check-in Validate Use Case', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new CheckInValidateUseCase(checkInsRepository);

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useFakeTimers();
	});

	it('should be able to validate the check-in', async () => {
		const createdCheckIn = await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		});
        
		const { checkIn } = await sut.execute({
			checkInId: createdCheckIn.id
		});

		expect(checkIn.validated_at).toEqual(expect.any(Date));
		expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
	});

	it('should not be able to validate an inexisting check-in', async () => {        
		await expect(() => 
			sut.execute({
				checkInId: 'inexistent check-in id'
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});

	it('sould not be able to validate the check-in after 20 minutes of its creation', async () => {
		vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

		const createdCheckIn = await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		});

		const limitTimePlusOneMinutesInMs = 1000 * 60 * (maximunCheckInValidationTime + 1);

		vi.advanceTimersByTime(limitTimePlusOneMinutesInMs);
        
		await expect(() => 
			sut.execute({
				checkInId: createdCheckIn.id
			})
		).rejects.toBeInstanceOf(LateCheckInValidationError);
	});
});
