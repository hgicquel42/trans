import { Controller, Get } from '@nestjs/common';

@Controller()
export class Hello {
  constructor() { }

  @Get()
  hello(): string {
    return "lol";
  }
}
