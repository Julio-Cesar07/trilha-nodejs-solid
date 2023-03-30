import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { SearchGymsUseCase } from '../search-gyms';

export function makeCreateGymUseCase() {
	const gymsRepository = new PrismaGymsRepository();
	const useCase = new SearchGymsUseCase(gymsRepository);

	return useCase;
}