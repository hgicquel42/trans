import { IsNotEmpty, IsString } from "class-validator";

export class TwoFaAuthCodeDto {
	@IsString()
	@IsNotEmpty()
	twoFaAuthCode: string
}