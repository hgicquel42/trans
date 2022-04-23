import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from "@nestjs/platform-express";
import { WsAdapter } from '@nestjs/platform-ws';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import * as express from "express";
import * as fs from "fs";
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as https from "https";
import { App } from './app';

config({ path: ".env.local" });

const httpsOptions = {
  key: fs.readFileSync("./certs/hugo.key"),
  cert: fs.readFileSync("./certs/hugo.cert"),
}

async function bootstrap() {
  const server = express()
  const proxy = createProxyMiddleware({ target: "http://localhost:3000" })
  server.use("*", function (req, res, next) {
    if (req.originalUrl.startsWith("/api"))
      next()
    else
      proxy(req, res, next)
  });

  const app = await NestFactory.create(App, new ExpressAdapter(server));
  app.setGlobalPrefix("/api")
  app.enableCors()
  app.use(cookieParser());
  app.useWebSocketAdapter(new WsAdapter(app))
  await app.init();
  https.createServer(httpsOptions, server).listen(3001);
}

bootstrap();
