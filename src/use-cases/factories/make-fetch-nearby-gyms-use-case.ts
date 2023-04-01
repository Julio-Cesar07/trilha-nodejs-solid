import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { FeatchNearbyGym } from '../fetch-nearby-gyms';

export function makeFetchNearbyGymsUseCase() {
	const gymsRepository = new PrismaGymsRepository();
	const useCase = new FeatchNearbyGym(gymsRepository);

	return useCase;
}