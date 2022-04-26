import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from 'express';
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/db/user/user.service";
import { TokenPayloadDto } from "../dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
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
		return this.userService.getUserById(payload.sub)
	}
}