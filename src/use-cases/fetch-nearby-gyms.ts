import { GymsRepository } from '@/repositories/gyms-repository';
import { Gym } from '@prisma/client';

interface FeatchNearbyGymRequest {
    userLatitude: number
    userLongitude: number
}

interface FeatchNearbyGymResponse {
    gyms: Gym[]
}

export class FeatchNearbyGym {
	constructor(private gymsRepository: GymsRepository){}

	async execute({
		userLatitude,
		userLongitude
	}: FeatchNearbyGymRequest): Promise<FeatchNearbyGymResponse> {
		const gyms = await this.gymsRepository.findManyNearby({latitude: userLatitude, longitude: userLongitude});

		return {
			gyms
		};
	}
}