import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import axios from "axios";
import { randomUUID } from "crypto";
import { Request, Response } from "express";

function jtobu(data: any) {
  return Buffer.from(JSON.stringify(data)).toString("base64url")
}

function butoj(data: string) {
  return JSON.parse(Buffer.from(data, "base64url").toString())
}

@Controller()
export class Hello {
  constructor() { }

  @Post("/preauth")
  async preauth(
    @Res({ passthrough: true }) res: Response,
    @Body("path") pathname: string
  ) {
    const random = randomUUID().split("-")[0]
    const state = jtobu({ random, pathname })

    res.cookie("state", state, {
      httpOnly: true,
      sameSite: true
    })

    return state
  }

  @Post("/auth")
  async auth(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body("code") code: string,
    @Body("state") state: string,
    @Body("state") redirect: string
  ) {
    console.log(req.cookies)

    const { data } = await axios.post<{
      "access_token": string,
      "token_type": string,
      "expires_in": number,
      "scope": "public",
      "created_at": number
    }>("https://api.intra.42.fr/oauth/token", {
      grant_type: "authorization_code",
      client_id: process.env.X42_UID,
      client_secret: process.env.X42_SECRET,
      redirect_uri: redirect,
      code: code,
      state: req.cookies["state"]
    })

    res.clearCookie("state", {
      httpOnly: true,
      sameSite: true
    })

    res.cookie("token", data.access_token, {
      httpOnly: true,
      sameSite: true,
      maxAge: data.expires_in
    })

    return butoj(req.cookies["state"]).pathname
  }
}
