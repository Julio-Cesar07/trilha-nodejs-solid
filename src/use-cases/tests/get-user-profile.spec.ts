import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { expect, describe, it, beforeEach } from 'vitest';
import { GetUserProfileUseCase } from '../get-user-profile';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

let usersRepository: InMemoryUserRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUserRepository();
		sut = new GetUserProfileUseCase(usersRepository);
	});

	it('should be able to get user profile', async () => {
		const { id } = await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6)
		});

		const {user} = await sut.execute({
			userId: id
		});

		expect(user.id).toEqual(expect.any(String));
		expect(user.name).toEqual('John Doe');
		expect(user.email).toEqual('johndoe@example.com');
	});

	it('should not be able to get user profile with wrong id', async () => {
		await expect(() => 
			sut.execute({
				userId: 'non-existing-id'
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});