import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { UserService } from 'src/db/user/user.service';

@Injectable()
export class TwofaAuthService {
	constructor(private userService: UserService,
		private config: ConfigService) { }

	async generate2FaAuthSecrect(user: User) {
		const secret = authenticator.generateSecret()

		const otpauthUrl = authenticator.keyuri(user.username, this.config.get('APP_NAME'), secret)

		await this.userService.set2FaAuthSecret(secret, user.id)

		return { secret, otpauthUrl }
	}

	async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return toFileStream(stream, otpauthUrl)
	}

	isTwoFaAuthCodeValid(twoFaAuthCode: string, user: User) {
		return authenticator.verify({
			token: twoFaAuthCode,
			secret: user.twoFaAuthSecret
		})
	}
}
