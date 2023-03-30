import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { GetUserMetricsCheckInUseCase } from '../get-user-metrics';

export function makeGetUserMetrics() {
	const chekInsRepository = new PrismaCheckInsRepository();
	const useCase = new GetUserMetricsCheckInUseCase(chekInsRepository);

	return useCase;
}