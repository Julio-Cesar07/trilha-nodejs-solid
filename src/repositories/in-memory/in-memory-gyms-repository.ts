import { getDistanceBetweenCoordinate } from '@/utils/get-distance-between-coordinates';
import { numberPagesPagination } from '@/utils/number-pages-pagination';
import { Gym, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { FindManyNearby, GymsRepository } from '../gyms-repository';

export class InMemoryGymsRpository implements GymsRepository{
	public items: Gym[] = [];

	async create(data: Prisma.GymCreateInput): Promise<Gym> {
		const gym : Gym = {
			id: data.id ?? randomUUID(),
			latitude: new Prisma.Decimal(data.latitude.toString()),
			longitude: new Prisma.Decimal(data.longitude.toString()),
			title: data.title,
			description: data.description ?? null,
			phone: data.phone ?? null
		};

		this.items.push(gym);
		return gym;
	}

	async findById(id: string): Promise<Gym | null> {
		const gym = this.items.find((item) => item.id === id);

		if(!gym)
			return null;

		return gym;
	}

	async searchMany(query: string, page: number): Promise<Gym[]> {
		return this.items
			.filter(item => item.title.includes(query))
			.slice((page-1) * numberPagesPagination, page * numberPagesPagination);
	}

	async findManyNearby(params: FindManyNearby): Promise<Gym[]> {
		return this.items.filter(item => {
			const distance = getDistanceBetweenCoordinate(
				{latitude: params.latitude,
					longitude: params.longitude},
				{latitude: item.latitude.toNumber(), longitude: item.longitude.toNumber()});
			
			console.log(distance);
			return distance < 10;
		});
	}
}