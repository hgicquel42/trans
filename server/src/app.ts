import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { ChatController } from "./chat";
import { AppModule } from "./db/app.module";
import { UserService } from "./db/user/user.service";
import { GameController } from "./game";
import { Profile } from "./profile";
import { Root } from './root';

@Module({
	imports: [AppModule, JwtModule.register({})],
	controllers: [Root, Profile],
	providers: [ChatController, GameController, UserService],
})
export class App { }
