import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createGymBodySchema = z.object({
		title: z.string(),
		description: z.string().nullable(),
		latitude: z.number().refine((value) => {
		// validação personalizavel do zod
		// onde deve retornar true or false
			return Math.abs(value) <= 90;
		}),
		longitude: z.number().refine((value) => {
			return Math.abs(value) <= 180;
		}),
		phone: z.string().nullable(),
	});

	const { description, latitude, longitude, phone, title } = createGymBodySchema.parse(request.body);

	const createGymUseCase = makeCreateGymUseCase();

	await createGymUseCase.execute({
		title,
		description,
		latitude,
		longitude,
		phone,
	});	

	return reply.status(201).send();
}

