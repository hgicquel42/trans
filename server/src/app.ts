import { Module } from '@nestjs/common';
import { ChatController } from "./chat";
import { Hello } from './hello';

@Module({
  imports: [],
  controllers: [Hello],
  providers: [ChatController],
})
export class App { }
