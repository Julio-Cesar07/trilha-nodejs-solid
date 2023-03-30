import { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyJWT(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		// na função jwtVerify, se a verificação for um sucesso, ela vai colocar os campos (sub por exemplo) dentro de request.user
		await request.jwtVerify();
	} catch (err) {
		return reply.status(401).send({ message: 'Unauthorized.'});
	}
}