import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { UserService } from 'src/db/user/user.service';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService,
		private jwtService: JwtService,
		private userService: UserService,
		private config: ConfigService) { }

	// Verify if the user is already in the database, if not add it to the db
	async validateUser(userInfo: { username: string, photos: { value: string } }) {
		const user = await this.prisma.user.findUnique({
			where: {
				nickname: userInfo.username
			}
		})
		if (user) {
			this.userService.updateUser(user.id, { status: 'login' })
			return user
		}
		const newUser = await this.prisma.user.create({
			data: {
				username: userInfo.username,
				nickname: userInfo.username,
				photo: userInfo.photos[0].value
			},
		})
		return newUser
	}

	getJwtToken(userId: number, isSecondFaAuth = false) {
		const payload = { sub: userId, isSecondFaAuth }
		const token = this.jwtService.sign(payload, {
			secret: this.config.get('JWT_SECRET'),
			expiresIn: this.config.get('JWT_EXPIRE_TIME')
		})
		return token
	}

	getJwtRefreshToken(userId: number) {
		const payload = { sub: userId }
		const token = this.jwtService.sign(payload, {
			secret: this.config.get('JWT_REFRESH_SECRET'),
			expiresIn: this.config.get('JWT_REFRESH_EXPIRE_TIME')
		})
		return token
	}
}
