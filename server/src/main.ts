import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { config } from 'dotenv';
import { App } from './app';

config({ path: ".env.local" });

async function bootstrap() {
  const app = await NestFactory.create(App);
  app.enableCors()
  app.useWebSocketAdapter(new WsAdapter(app))
  await app.listen(3001);
}
bootstrap();
