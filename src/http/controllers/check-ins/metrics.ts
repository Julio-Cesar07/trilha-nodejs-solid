import { makeGetUserMetrics } from '@/use-cases/factories/make-get-user-metrics-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function metrics(request: FastifyRequest, reply: FastifyReply) {    
	const getUserMetricsCheckInUseCase = makeGetUserMetrics();

	const { count_checkIns } = await getUserMetricsCheckInUseCase.execute({
		userId: request.user.sub
	});

	return reply.status(200).send({
		count_checkIns
	});
}