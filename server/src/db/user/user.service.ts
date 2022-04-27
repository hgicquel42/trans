import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { UserUpdateDto } from './dto';
import { UserHistoryDto } from './dto/user-history.dto';
import { UserRequestDto } from './dto/user-request.dto';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) { }

	getRawUserById(userId: number) {
		return this.prisma.user.findUnique({
			where: {
				id: userId
			},
			include: {
				friends: true,
				friendsRequest: true,
				history: true
			}
		})
	}

	async getUserById(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			include: {
				friends: true,
				friendsRequest: true,
				history: true
			}
		})

		let info = {}
		for (const property in user) {
			if (property === 'friends')
				info['friends'] = await this.getFriendListById(userId)
			else if (property === 'friendsRequest')
				info['requestFriend'] = await this.getRequestListById(userId)
			else if (property === 'history')
				info['history'] = await this.getHistoryById(userId)
			else
				info[property] = user[property]
		}

		return info
	}

	async getFriendListById(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			include: {
				friends: true
			}
		})

		const pfriends = user.friends.map(
			f => this.getRawUserById(f.friendId))
		const friends = await Promise.all(pfriends)

		return friends
	}

	async getRequestListById(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			include: {
				friendsRequest: true
			}
		})

		const prequestFriends = user.friendsRequest.map(async f => {
			const newReq: UserRequestDto = {
				user: await this.prisma.user.findUnique({
					where: {
						id: f.userId
					}
				}),
				requestId: f.id
			}
			return newReq
		})
		const requestFriend = await Promise.all(prequestFriends)

		return requestFriend
	}

	async getHistoryById(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			include: {
				history: true
			}
		})

		const phistory = user.history.map(async h => {
			const newHistory: UserHistoryDto = {
				userId: h.userId,
				result: h.result,
				userScore: h.userScore,
				opponentScore: h.opponentScore,
				opponent: await this.prisma.user.findUnique({
					where: {
						id: h.opponentId
					}
				}),
				mode: h.mode
			}
			return newHistory
		})
		const history = await Promise.all(phistory)

		return history
	}

	async updateUser(userId: number, userUpdate: UserUpdateDto) {
		const user = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				...userUpdate,
			}
		})
		return user
	}

	async logout(userId: number) {
		this.updateUser(userId, {
			status: 'Unavailable',
			currentHashedRefreshToken: null
		})
	}

	async getUserOrderedByWinRate() {
		return await this.prisma.user.findMany({
			orderBy: [
				{
					win: 'desc'
				},
				{
					loose: 'asc'
				}
			]
		})
	}

	async set2FaAuthSecret(secret: string, userId: number) {
		return this.updateUser(userId, { twoFaAuthSecret: secret })
	}

	async turnOnTwoFaAuth(userId: number) {
		return this.updateUser(userId, { twoFA: true })
	}

	async turnOffTwoFaAuth(userId: number) {
		return this.updateUser(userId, { twoFA: false })
	}

	async setCurrentRefreshToken(refreshToken: string, userId: number) {
		const hash = await bcrypt.hash(refreshToken, 10)
		return this.updateUser(userId, { currentHashedRefreshToken: hash })
	}

	async getUserIfRefreshTokenMathes(refreshToken: string, userId: number) {
		const user = await this.getRawUserById(userId)

		const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken)

		if (isRefreshTokenValid)
			return user
	}
}