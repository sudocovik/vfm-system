export class Speed {
  public static fromKnots (value: number): Speed {
    return new Speed(value)
  }

  public static fromKph (value: number): Speed {
    return new Speed(value / 1.852)
  }

  private constructor (private knots: number) {}

  public toKnots (): number {
    return this.knots
  }

  public toKph (): number {
    return this.knots * 1.852
  }
}
