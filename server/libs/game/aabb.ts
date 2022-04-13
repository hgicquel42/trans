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
}

export class DDAABB extends DAABB {
  public ddx = 0
  public ddy = 0
}