import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { maximunCheckInValidationTime } from '@/utils/maximun-check-in-validation-time';
import { CheckIn } from '@prisma/client';
import dayjs from 'dayjs';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface CheckInValidateUseCaseRequest {
    checkInId: string,
}

interface CheckInValidateUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInValidateUseCase {
	constructor(
		private checkInsRepository: CheckInsRepository) {}

	async execute({
		checkInId 
	}: CheckInValidateUseCaseRequest): Promise<CheckInValidateUseCaseResponse> {
		const checkIn = await this.checkInsRepository.findById(checkInId);

		if (!checkIn) {
			throw new ResourceNotFoundError;
		}

		const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
			checkIn.created_at,
			'minutes'
		);

		if (distanceInMinutesFromCheckInCreation > maximunCheckInValidationTime){
			throw new LateCheckInValidationError();
		}

		checkIn.validated_at = new Date();

		await this.checkInsRepository.save(checkIn);

		return {
			checkIn
		};
	}
}