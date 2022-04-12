import { Module } from '@nestjs/common';
import { ChatController } from "./chat";
import { GameController } from "./game";
import { Hello } from './hello';

@Module({
  imports: [],
  controllers: [Hello],
  providers: [ChatController, GameController],
})
export class App { }
