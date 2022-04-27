import { DDAABB } from "./aabb"
import { h, w } from "./screen"

export class Ball extends DDAABB {
  public readonly minadx = 0.5

  public dx = 0
  public dy = 0

  public shadow = true

  constructor() {
    super(w / 2, h / 2, 42, 42)
  }
}