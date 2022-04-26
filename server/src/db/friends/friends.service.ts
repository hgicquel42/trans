import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';

@Injectable()
export class FriendsService {
	constructor(private prisma: PrismaService) { }

	// Make a friend request and verify some things (if the user already send a friend request etc...)
	async makeFriendRequest(userId: number, username: string) {
		const friend = await this.prisma.user.findUnique({
			where: {
				username: username
			},
			include: {
				friends: true,
				friendsRequest: true
			}
		})

		if (friend) {
			const validateFriendList = friend.friends.filter(obj => {
				return obj.friendId === userId
			})
			if (validateFriendList.length !== 0)
				return 'You are already friend with this user'

			const validateRequestList = friend.friendsRequest.filter(obj => {
				return obj.userId === userId
			})
			if (validateRequestList.length !== 0)
				return 'You have already send a request to this user'

			// same verification for the user who send the request todo

			return this.prisma.friendRequest.create({
				data: {
					userId: userId,
					requestFriendId: friend.id
				}
			})
		}
		return 'The user does\'nt exist!'
	}

	// Add a friend field in the db
	addFriend(userId: number, friendId: number) {
		return this.prisma.friends.create({
			data: {
				userId: userId,
				friendId: friendId
			}
		})
	}

	// Delete the request and add both friends to their own list
	async acceptFriendRequest(requestId: number, userId: number, friendId: number) {
		const deleted = await this.prisma.friendRequest.delete({
			where: {
				id: requestId
			}
		})

		if (!deleted)
			return

		await this.addFriend(userId, friendId)
		await this.addFriend(friendId, userId)

		return 'Friend succesfully added'
	}

	// Delete the request
	async rejectFriendRequest(requestId: number) {
		const deleted = await this.prisma.friendRequest.delete({
			where: {
				id: requestId
			}
		})

		if (!deleted)
			return

		return 'Friend succesfully rejected'
	}

	// Manage the response for the request
	async manageFriendRequest(requestId: number, userId: number, response: boolean) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			include: {
				friendsRequest: true
			}
		})

		const request = user.friendsRequest.filter(obj => {
			return obj.id === requestId
		})[0]

		if (!request)
			return

		if (response) {
			return this.acceptFriendRequest(request.id, userId, request.userId)
		} else
			return this.rejectFriendRequest(request.id)
	}
}
