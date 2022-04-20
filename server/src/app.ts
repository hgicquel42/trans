import { Module } from '@nestjs/common';
import { ChatController } from "./chat";
import { GameController } from "./game";
import { Profile } from "./profile";
import { Root } from './root';

@Module({
  imports: [],
  controllers: [Root, Profile],
  providers: [ChatController, GameController],
})
export class App { }
