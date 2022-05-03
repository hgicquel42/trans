import { User } from '.prisma/client';
import { Body, Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/db/auth/decorator';
import { JwtTwoFaGuard } from 'src/db/auth/twofa-auth/guards';
import { PrismaService } from "../prisma/prisma.service";
import { UserUpdateDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtTwoFaGuard)
@Controller('user')
export class UserController {
	constructor(private userService: UserService,
		private prisma: PrismaService) { }

	// Get the info of the current user (the one who make the query)
	//@Header('Access-Control-Allow-Origin', 'http://localhost:3000')
	//@Header('Access-Control-Allow-Credentials', 'true')
	@Get('me')
	getMe(@GetUser() user: User) {
		return this.userService.getUserById(user.id)
	}

	@Get('leaderboard')
	leaderboard() {
		return this.userService.getUserOrderedByWinRate()
	}

	@Get(':username')
	getUserByUsername(@Param('username') username: string) {
		return this.userService.getUserByUsername(username)
	}

	// Get the info of the user refering to the id pass in paramater
	@Get(':id')
	getUser(@Param('id', ParseIntPipe) userId: number) {
		return this.userService.getUserById(userId)
	}

	// Get the friend list of the current user (the one who make the query)
	//@Header('Access-Control-Allow-Origin', 'http://localhost:3000')
	//@Header('Access-Control-Allow-Credentials', 'true')
	@Get('me/friends')
	getFriends(@GetUser() user: User) {
		return this.userService.getFriendListById(user.id)
	}

	// Get the friend request list of the current user (the one who make the query)
	@Get('me/friendsRequest')
	getRequest(@GetUser() user: User) {
		return this.userService.getRequestListById(user.id)
	}

	// Get the match history of the current user (tu connais la chanson)
	@Get('me/history')
	getHistory(@GetUser() user: User) {
		return this.userService.getHistoryById(user.id)
	}

	@Get(':id/history')
	getHistoryById(@Param('id', ParseIntPipe) userId: number) {
		return this.userService.getHistoryById(userId)
	}

	// Update the user in terms of what you send in the body (ex: if you send a body with only a username, it will modify the username of the current user)
	// You can update as many field as you want in one query
	@Patch('edit')
	async updateUser(@GetUser() user: User, @Body() userUpdate: UserUpdateDto) {
		if (userUpdate?.username) {
			const user = await this.prisma.user.findUnique({
				where: {
					username: userUpdate.username
				}
			})
			if (user) {
				return 'Username already used'
			}
		}
		return this.userService.updateUser(user.id, userUpdate)
	}
}
