import { Prisma, User } from '@prisma/client';

export interface UsersRepository {
    create(data: Prisma.UserCreateInput): Promise<User>,
    findById(id: string): Promise<User | null>,
    findUniqueEmail(email: string): Promise<User | null>
}