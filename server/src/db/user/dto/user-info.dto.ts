export class UserInfoDto {
	id: number = 0
	username: string
	logName: string

	createdAt: string

	win: number
	loose: number

	status: string

	twoFA: boolean
	twoFaAuthSecret: string

	photo: string

	currentHashedRefreshToken: string

	friends: any
	requestFriend: any
	history: any
}