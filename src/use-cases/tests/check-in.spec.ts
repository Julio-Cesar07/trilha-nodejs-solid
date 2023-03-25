import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRpository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { CheckInUseCase } from '../check-in';
import { MaxDistanceError } from '../errors/max-distance-error';
import { MaxNumberOfCheckInsError } from '../errors/max-number-of-check-ins-error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRpository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRpository();
		sut = new CheckInUseCase(checkInsRepository, gymsRepository);

		gymsRepository.create({
			id: 'gym-01',
			title: 'JS Gym',
			description: '',
			phone: '',
			latitude: -21.9788402,
			longitude: -47.880122
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useFakeTimers();
	});

	it('should be able to check in', async () => {
		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -21.9788402,
			userLongitude: -47.880122
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
		
		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -21.9788402,
			userLongitude: -47.880122
		});

		await expect(() => 
			sut.execute({
				gymId: 'gym-01',
				userId: 'user-01',
				userLatitude: -21.9788402,
				userLongitude: -47.880122
			})
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it('should be able to check in twice but in the different days', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
		
		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -21.9788402,
			userLongitude: -47.880122
		});

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -21.9788402,
			userLongitude: -47.880122
		});

		expect(checkIn.id).toEqual(expect.any(String));
		// retorna um valor não falso
	});

	it('should not be able to check in on distant gym', async () => {
		await gymsRepository.create({
			id: 'gym-02',
			title: 'JS Gym',
			description: '',
			phone: '',
			latitude: new Decimal(-21.9937656),
			longitude: new Decimal(-47.8893207)
		});

		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await expect(() => sut.execute({
			gymId: 'gym-02',
			userId: 'user-01',
			userLatitude: -21.9788402,
			userLongitude: -47.880122
		})).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
