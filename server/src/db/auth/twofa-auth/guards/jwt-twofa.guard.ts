import { AuthGuard } from "@nestjs/passport";

export class JwtTwoFaGuard extends AuthGuard('jwt-two-factor') {
	constructor() {
		super()
	}
}