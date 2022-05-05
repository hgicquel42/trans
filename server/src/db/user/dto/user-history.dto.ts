import { User } from ".prisma/client"

export class UserHistoryDto {
	user: User
	result: boolean
	userScore: number
	opponentScore: number
	opponent: User
	mode: string
}