import { maximunCheckInValidationTime } from '@/utils/maximun-check-in-validation-time';

export class LateCheckInValidationError extends Error {
	constructor() {
		super(`The check-in can only be validated until ${maximunCheckInValidationTime} minutes of its creation`);
	}
}