import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { expect, describe, it, beforeEach } from 'vitest';
import { AuthenticateUseCase } from '../authenticate';
import { InvalidCredentialErrors } from '../errors/invalid-credentials-error';

let usersRepository: InMemoryUserRepository;
let sut: AuthenticateUseCase;

describe('Authenticase Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUserRepository();
		sut = new AuthenticateUseCase(usersRepository);
	});

	it('should be able to authenticate', async () => {
		await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6)
		});

		const {user} = await sut.execute({
			email: 'johndoe@example.com',
			password: '123456'
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it('should not be able to authenticate with wrong email', async () => {
		await expect(() => 
			sut.execute({
				email: 'johndoe@example.com',
				password: '123456'
			}),
		).rejects.toBeInstanceOf(InvalidCredentialErrors);
	});
    
	it('should not be able to authenticate with wrong password', async () => {
		await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6)
		});
    
		await expect(() => 
			sut.execute({
				email: 'johndoe@example.com',
				password: '123123'
			}),
		).rejects.toBeInstanceOf(InvalidCredentialErrors);
	});
});