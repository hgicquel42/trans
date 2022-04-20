import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { App } from './app';
import * as fs from "fs"

config({ path: ".env.local" });

const httpsOptions = {
  key: fs.readFileSync("./certs/hugo.key"),
  cert: fs.readFileSync("./certs/hugo.pem"),
}

async function bootstrap() {
  const app = await NestFactory.create(App, { httpsOptions });
  app.enableCors()
  app.use(cookieParser());
  app.useWebSocketAdapter(new WsAdapter(app))
  await app.listen(3001);
}

bootstrap();
