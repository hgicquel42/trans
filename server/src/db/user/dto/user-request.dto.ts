import { User } from ".prisma/client";

export class UserRequestDto {
	user: User
	requestId: number
}