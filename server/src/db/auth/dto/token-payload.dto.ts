import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator"

export class TokenPayloadDto {
	@IsNumber()
	@IsNotEmpty()
	sub: number

	@IsBoolean()
	@IsOptional()
	isSecondFaAuth?: boolean

	@IsNumber()
	iat: number

	@IsNumber()
	exp: number
}