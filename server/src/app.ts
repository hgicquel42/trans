import { Module } from '@nestjs/common';
import { ChatController } from "./chat";
import { AppModule } from "./db/app.module";
import { GameController } from "./game";
import { Profile } from "./profile";
import { Root } from './root';

@Module({
	imports: [AppModule],
	controllers: [Root, Profile],
	providers: [ChatController, GameController],
})
export class App { }
