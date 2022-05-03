import { User } from '.prisma/client';
import { Body, Controller, Get, Param, Patch, Post, Redirect, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/db/user/user.service';
import { AuthService } from '../auth.service';
import { GetUser } from '../decorator';
import { JwtGuard } from '../guards';
import { TwoFaAuthCodeDto } from './dto';
import { JwtTwoFaGuard } from './guards';
import { TwofaAuthService } from './twofa-auth.service';

@Controller('twofa-auth')
export class TwofaAuthController {
	constructor(private twofaAuthService: TwofaAuthService,
		private userService: UserService,
		private authService: AuthService) { }

	@Get('generate')
	@UseGuards(JwtGuard)
	async register(@Res() res: Response, @GetUser() user: User) {
		const { otpauthUrl } = await this.twofaAuthService.generate2FaAuthSecrect(await this.userService.getRawUserById(user.id))

		const qrcode = await this.twofaAuthService.pipeQrCodeStream(res, otpauthUrl)

		return qrcode
	}

	@Post('turn-on')
	@UseGuards(JwtGuard)
	@Redirect('https://localhost:8080/profil')
	async turnOnTwoFaAuth(
		@GetUser() user: User,
		@Body() { twoFaAuthCode }: TwoFaAuthCodeDto,
		@Res() res: Response
	) {
		const isCodeValid = this.twofaAuthService.isTwoFaAuthCodeValid(twoFaAuthCode, await this.userService.getRawUserById(user.id))
		if (!isCodeValid)
			return 'Error wrong code'
		const access_token = this.authService.getJwtToken(user.id, true)
		res.cookie('Authentication', access_token, { httpOnly: true, sameSite: true, secure: true })
		this.authService.setCurrentTokenExpTime(user.id)
		return await this.userService.turnOnTwoFaAuth(user.id)
	}

	@Patch('turn-off')
	@UseGuards(JwtTwoFaGuard)
	async turnOffTwoFaAuth(@GetUser() user: User) {
		return this.userService.turnOffTwoFaAuth(user.id)
	}

	@Get('authenticate/:code')
	//@Redirect('https://localhost:8080')
	@UseGuards(JwtGuard)
	async authenticate(
		@GetUser() user: User,
		@Param('code') twoFaAuthCode: string,
		@Res() res: Response
	) {
		const isCodeValid = this.twofaAuthService.isTwoFaAuthCodeValid(twoFaAuthCode, user)
		if (!isCodeValid)
			return res.redirect('https://localhost:8080?twofa=true')

		const access_token = this.authService.getJwtToken(user.id, true)
		res.cookie('Authentication', access_token, { httpOnly: true, sameSite: true, secure: true })
		this.authService.setCurrentTokenExpTime(user.id)
		const refresh_token = this.authService.getJwtRefreshToken(user.id)
		await this.userService.setCurrentRefreshToken(refresh_token, user.id)
		res.cookie('Refresh', refresh_token, { httpOnly: true })

		//res.send(user)/*.redirect('http://localhost:3000')*/
		return res.redirect('https://localhost:8080')
	}
}
