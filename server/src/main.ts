import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { App } from './app';

async function bootstrap() {
  const app = await NestFactory.create(App);
  app.useWebSocketAdapter(new WsAdapter(app))
  await app.listen(3001);
}
bootstrap();
