import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";
import { AuthService } from "../auth.service";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService,
    config: ConfigService) {
    super({
      grant_type: 'authorization_code',
      clientID: config.get('42_CLIENT_ID'),
      clientSecret: config.get('42_CLIENT_SECRET'),
      callbackURL: config.get('42_REDIRECT_URL'),
      scope: 'public'
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { username, photos } = profile
    const user = await this.authService.validateUser({ username, photos })
    if (!user)
      throw new UnauthorizedException()
    return user
  }
}