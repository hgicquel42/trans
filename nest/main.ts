import { NestFactory } from "@nestjs/core";
import { NextApiHandler } from "next";
import "reflect-metadata";
import { AppModule } from "./app/app.module";

export const nest = new Promise<NextApiHandler>(async ok => {
  const app = await NestFactory.create(AppModule, { bodyParser: false })
  app.setGlobalPrefix("api");
  await app.init();

  const server = app.getHttpServer();
  const listeners = server.listeners("request");

  ok(listeners[0])
})