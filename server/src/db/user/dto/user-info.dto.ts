export class UserInfoDto {
	id: number = 0
	username: string
	nickname: string

	createdAt: string

	win: number
	loose: number

	status: string

	twoFA: boolean
	twoFaAuthSecret: string

	photo: string

	currentHashedRefreshToken: string

	currentTokenExpirationTime: number

	friends: any
	requestFriend: any
	history: any
}