import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from 'express';
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/db/user/user.service";
import { TokenPayloadDto } from "../dto";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private userService: UserService,
		config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
				return request?.cookies?.Refresh;
			}]),
			secretOrKey: config.get('JWT_REFRESH_SECRET'),
			passReqToCallback: true
		})
	}

	async validate(request: Request, payload: TokenPayloadDto) {
		const refresh_token = request?.cookies?.Refresh
		return this.userService.getUserIfRefreshTokenMathes(refresh_token, payload.sub)
	}
}