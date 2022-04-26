import { User } from '.prisma/client';
import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/db/auth/decorator';
import { JwtTwoFaGuard } from 'src/db/auth/twofa-auth/guards';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { FriendsService } from './friends.service';

@UseGuards(JwtTwoFaGuard)
@Controller('friends')
export class FriendsController {
	constructor(private prisma: PrismaService,
		private friendsService: FriendsService) { }

	// Make a friend request to the user with the matching username in the body
	@Post('add')
	async addFriend(@GetUser() user: User, @Body() info: { username: string }) {
		console.log("test")
		return this.friendsService.makeFriendRequest(user.id, info.username)
	}

	// Manege the response of the friend request:
	// If the user accept, it delete the request and match the friends in the db
	// Else if the user reject, it only delete the friend request
	@Patch('manage')
	manageFriendRequest(@GetUser() user: User, @Body() requestInfo: { response: boolean, requestId: number }) {
		return this.friendsService.manageFriendRequest(requestInfo.requestId, user.id, requestInfo.response)
	}
}
