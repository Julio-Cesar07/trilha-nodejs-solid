import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { numberPagesPagination } from '@/utils/number-pages-pagination';
import { Prisma, CheckIn } from '@prisma/client';
import dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';
import { CheckInsRepository } from '../check-ins-repository';

export class InMemoryCheckInsRepository implements CheckInsRepository{
	public items: CheckIn[] = [];

	async create(data: Prisma.CheckInUncheckedCreateInput){
		const checkIn = {
			id: randomUUID(),
			gym_id: data.gym_id,
			user_id: data.user_id,
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
			created_at: new Date(),
		};

		this.items.push(checkIn);

		return checkIn;
	}

	async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
		const startOfTheDay = dayjs(date).startOf('date');
		const endOfTheDay = dayjs(date).endOf('date');
		
		const checkInOnSameDate = this.items.find(checkIn => {
			const checkInDate = dayjs(checkIn.created_at);
			const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);
			return checkIn.user_id === userId && isOnSameDate;
		});

		if (!checkInOnSameDate)
			return null;
		return checkInOnSameDate;
	}
	
	async findAllByUserId(userId: string, page: number): Promise<CheckIn[]> {
		return this.items
			.filter(item => item.user_id === userId)
			.slice((page - 1) * numberPagesPagination, (page * numberPagesPagination));
	}

	async findById(checkInId: string): Promise<CheckIn | null> {
		const checkIn = this.items.find(item => item.id === checkInId);
		
		if(!checkIn)
			return null;

		return checkIn;
	}

	async countByUserId(userId: string): Promise<number> {
		return this.items.filter(item => item.user_id === userId).length;
	}

	async save(checkIn: CheckIn): Promise<CheckIn> {
		const checkInIndex = this.items.findIndex(item => item.id === checkIn.id);

		if (checkInIndex == -1){
			throw new ResourceNotFoundError;
		}

		this.items[checkInIndex] = checkIn;

		return checkIn;
	}
}