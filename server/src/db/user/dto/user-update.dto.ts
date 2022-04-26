import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UserUpdateDto {
	@IsString()
	@IsOptional()
	username?: string

	@IsString()
	@IsOptional()
	status?: string

	@IsString()
	@IsOptional()
	photo?: string

	@IsBoolean()
	@IsOptional()
	twoFA?: boolean

	@IsNumber()
	@IsOptional()
	win?: number

	@IsNumber()
	@IsOptional()
	loose?: number

	@IsString()
	@IsOptional()
	twoFaAuthSecret?: string

	@IsString()
	@IsOptional()
	currentHashedRefreshToken?: string
}