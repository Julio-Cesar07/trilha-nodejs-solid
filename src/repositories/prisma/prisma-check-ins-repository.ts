import { prisma } from '@/lib/prisma';
import { Prisma, CheckIn } from '@prisma/client';
import { CheckInsRepository } from '../check-ins-repository';
import { numberPagesPagination } from '@/utils/number-pages-pagination';
import dayjs from 'dayjs';

export class PrismaCheckInsRepository implements CheckInsRepository {
	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn = await prisma.checkIn.create({
			data,
		});

		return checkIn;
	}
	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfTheDay = dayjs(date).startOf('date');
		const endOfTheDay = dayjs(date).endOf('date');

		const checkIn = await prisma.checkIn.findFirst({
			where: {
				user_id: userId,
				created_at: {
					gte: startOfTheDay.toDate(),
					lte: endOfTheDay.toDate(),
				}
			}
		});

		return checkIn;
	}
	async findAllByUserId(userId: string, page: number) {
		const checkIns = await prisma.checkIn.findMany({
			where: {
				user_id: userId
			},
			take: numberPagesPagination, //quantos items pegar (limit bd)
			skip: (page - 1) * numberPagesPagination, //quantos itens pular (offset)
		});

		return checkIns;
	}
	async findById(checkInId: string) {
		const checkIn = await prisma.checkIn.findUnique({
			where: {
				id: checkInId,
			}
		});

		return checkIn;
	}
	async countByUserId(userId: string) {
		const countCheckIns = await prisma.checkIn.count({
			where: {
				user_id: userId,
			}
		});

		return countCheckIns;
	}
	async save(checkIn: CheckIn) {
		const checkInSaved = await prisma.checkIn.update({
			where: {
				id: checkIn.id
			},
			data: checkIn
		});

		return checkInSaved;
	}

}