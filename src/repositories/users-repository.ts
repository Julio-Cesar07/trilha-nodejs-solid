import { Prisma, User } from '@prisma/client';

export interface UsersRepository {
    create(data: Prisma.UserCreateInput): Promise<User>,
    findUniqueEmail(email: string): Promise<User | null>
}