import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from 'express';
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayloadDto } from "src/db/auth/dto";
import { UserService } from "src/db/user/user.service";

@Injectable()
export class JwtTowFaStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
	constructor(private config: ConfigService,
		private userService: UserService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
				return request?.cookies?.Authentication;
			}]),
			secretOrKey: config.get('JWT_SECRET'),
			passReqToCallback: true
		})
	}

	async validate(request: Request, payload: TokenPayloadDto) {
		//if (payload.exp - payload.iat > this.config.get<number>('JWT_EXPIRE_TIME')) {
		//	console.log('test')
		//	return
		//}
		const timestamp_in_ms = new Date().getTime()
		const timestamp = Math.floor(timestamp_in_ms / 1000)
		if (payload.exp < timestamp)
			return

		const ref_token = request?.cookies?.Refresh
		const user = await this.userService.getUserIfRefreshTokenMathes(ref_token, payload.sub)

		//const user = await this.userService.getRawUserById(payload.sub)
		if (!user)
			return
		if (!user?.twoFA)
			return user
		if (payload.isSecondFaAuth)
			return user
	}
}