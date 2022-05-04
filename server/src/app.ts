import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { ChatController } from "./chat";
import { AppModule } from "./db/app.module";
import { HistoryService } from "./db/history/history.service";
import { MatchService } from "./db/match/match.service";
import { UserService } from "./db/user/user.service";
import { GameController } from "./game";
import { ChatService } from "./services/chat";
import { GameService } from "./services/game";

@Module({
  imports: [AppModule, JwtModule.register({})],
  controllers: [],
  providers: [ChatController, GameController, UserService, MatchService, HistoryService, GameService, ChatService],
})
export class App { }
