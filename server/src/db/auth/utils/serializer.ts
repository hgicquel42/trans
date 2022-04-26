import { User } from ".prisma/client";
import { PassportSerializer } from "@nestjs/passport";
import { PrismaService } from "src/db/prisma/prisma.service";

export class SessionSerializer extends PassportSerializer {
	constructor(private prisma: PrismaService) {
		super()
	}

	serializeUser(user: User, done: (err: Error, user: User) => void) {
		done(null, user)
	}

	async deserializeUser(user: User, done: (err: Error, user: User) => void) {
		const userDB = await this.prisma.user.findUnique({
			where: {
				id: user.id
			}
		})
		return userDB ? done(null, userDB) : done(null, null)
	}
}