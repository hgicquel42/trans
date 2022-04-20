import { Controller, Get } from "@nestjs/common";

@Controller("/profile")
export class Profile {

  @Get("/me")
  async me() {
    throw new Error("Not logged in")
    return { name: "chad" }
  }
}