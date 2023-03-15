import { UsersRepository } from '@/repositories/users-repository';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface RegisterUseCaseRequest {
    name: string,
    email: string,
    password: string
}

interface RegisterUseCaseResponse {
	user: User
}

export class RegisterUseCase {
	// private userRepository;
	// constructor(usersRepository: any) {this.userRepository = userRepository}
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		name,
		email,
		password
	}: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
		const password_hash = await hash(password, 6);
        
		// const prismaUsersRepository = new PrismaUsersRepository();
    
		const userWithSameEmail = await this.usersRepository.findUniqueEmail(email);
        
		if (userWithSameEmail){
			throw new UserAlreadyExistsError;
		}
        
		const user = await this.usersRepository.create({
			name,
			email,
			password_hash,
		});

		return { 
			user, 
		};
	}
}

