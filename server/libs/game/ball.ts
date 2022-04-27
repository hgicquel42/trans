import { DDAABB } from "./aabb"
import { h, w } from "./screen"

export class Ball extends DDAABB {
  public readonly minadx = 0.5

  public dx = this.minadx
  public dy = 0

  public shadow = false

  constructor() {
    super(w / 2, h / 2, 42, 42)
  }
}