import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';
import { HistoryModule } from './history/history.module';
import { MatchModule } from './match/match.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [ConfigModule.forRoot({
		isGlobal: true
	}),
		AuthModule,
		PrismaModule,
		UserModule,
		FriendsModule,
		HistoryModule,
		MatchModule],
})
export class AppModule { }
