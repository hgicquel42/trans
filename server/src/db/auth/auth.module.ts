import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/db/prisma/prisma.module';
import { UserService } from 'src/db/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './strategies';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtTowFaStrategy } from './twofa-auth/strategies';
import { TwofaAuthController } from './twofa-auth/twofa-auth.controller';
import { TwofaAuthService } from './twofa-auth/twofa-auth.service';
import { SessionSerializer } from './utils/serializer';

@Module({
	imports: [JwtModule.register({}), PrismaModule],
	controllers: [AuthController, TwofaAuthController],
	providers: [FortyTwoStrategy, AuthService, SessionSerializer, JwtStrategy, UserService, TwofaAuthService, JwtTowFaStrategy, JwtRefreshTokenStrategy]
})
export class AuthModule { }