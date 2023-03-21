import { UsersRepository } from '@/repositories/users-repository';
import { User } from '@prisma/client';
import { compare } from 'bcryptjs';
import { InvalidCredentialErrors } from './errors/invalid-credentials-error';

interface AuthenticateUseCaseRequest {
    email: string,
    password: string
}

interface AuthenticateUseCaseResponse {
    user: User
}

export class AuthenticateUseCase {
	constructor(
        private usersRepository: UsersRepository,
	) {}

	async execute({email, password}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		const user = await this.usersRepository.findUniqueEmail(email);

		if (!user)  {
			throw new InvalidCredentialErrors;
		}

		const doesPasswordMatches = await compare(password, user.password_hash);

		if(!doesPasswordMatches){
			throw new InvalidCredentialErrors;
		}

		return {
			user,
		};
	}
}