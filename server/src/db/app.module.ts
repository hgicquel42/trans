import { HttpModule, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { FriendsModule } from './friends/friends.module';
import { HistoryModule } from './history/history.module';
import { MatchModule } from './match/match.module';
import { ConfigModule } from '@nestjs/config';

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
export class AppModule {}
