import { User } from ".prisma/client"

export class UserHistoryDto {
	userId: number
	result: boolean
	userScore: number
	opponentScore: number
	opponent: User
	mode: string
}