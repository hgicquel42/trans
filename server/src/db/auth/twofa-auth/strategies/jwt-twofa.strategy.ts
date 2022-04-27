import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from 'express';
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayloadDto } from "src/db/auth/dto";
import { UserService } from "src/db/user/user.service";

@Injectable()
export class JwtTowFaStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
	constructor(config: ConfigService,
		private userService: UserService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
				return request?.cookies?.Authentication;
			}]),
			secretOrKey: config.get('JWT_SECRET'),
		})
	}

	async validate(payload: TokenPayloadDto) {
		console.log(payload)
		const user = await this.userService.getRawUserById(payload.sub)
		if (!user?.twoFA)
			return user
		if (payload.isSecondFaAuth)
			return user
	}
}