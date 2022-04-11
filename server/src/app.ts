import { Module } from '@nestjs/common';
import { Chat } from "./chat";
import { Hello } from './hello';

@Module({
  imports: [],
  controllers: [Hello],
  providers: [Chat],
})
export class App { }
