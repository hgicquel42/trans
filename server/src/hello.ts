import { Body, Controller, Post } from '@nestjs/common';
import axios from "axios";

@Controller()
export class Hello {
  constructor() { }

  @Post("/auth")
  async auth(@Body("code") code: string, @Body("state") state: string) {
    const endpoint = "https://api.intra.42.fr/oauth/token"
    const { data } = await axios.post(endpoint, {
      grant_type: "authorization_code",
      client_id: process.env.X42_UID,
      client_secret: process.env.X42_SECRET,
      redirect_uri: "http://localhost:3000/auth",
      code: code,
      state: state
    })
    return data
  }
}
