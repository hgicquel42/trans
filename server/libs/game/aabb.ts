export class AABB {
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number
  ) { }
}

export class DAABB extends AABB {
  public dx = 0
  public dy = 0

  inter(other: AABB) {
    return true
      && this.x + this.w >= other.x
      && this.x <= other.x + other.w
      && this.y + this.h >= other.y
      && this.y <= other.y + other.h
  }

  bounce(other: AABB) {
    const t = this.y + this.h - other.y
    const b = other.y + other.h - this.y
    const l = this.x + this.w - other.x
    const r = other.x + other.w - this.x

    if (t < b && t < l && t < r) {
      this.y = other.y - this.h
      this.dy *= -1
    }

    if (b < t && b < l && b < r) {
      this.y = other.y + other.h
      this.dy *= -1
    }

    if (l < r && l < t && l < b) {
      this.x = other.x - this.w
      this.dx *= -1
    }

    if (r < l && r < t && r < b) {
      this.x = other.x + other.w
      this.dx *= -1
    }
  }
}

export class DDAABB extends DAABB {
  public ddx = 0
  public ddy = 0
}