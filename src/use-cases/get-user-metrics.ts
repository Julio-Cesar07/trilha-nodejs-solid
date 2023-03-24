import { CheckInsRepository } from '@/repositories/check-ins-repository';

interface GetUserMetricsCheckInUseCaseRequest{
    userId: string
}

interface GetUserMetricsCheckInUseCaseResponse{
    count_checkIns: number
}

export class GetUserMetricsCheckInUseCase{
	constructor(private checkInsRepository: CheckInsRepository){}

	async execute({
		userId,
	}: GetUserMetricsCheckInUseCaseRequest): Promise<GetUserMetricsCheckInUseCaseResponse>{
		const count_checkIns = await this.checkInsRepository.countByUserId(userId);

		return{
			count_checkIns 
		};
	}
}