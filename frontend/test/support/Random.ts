export class Random {
  public static string (length: number): string {
    return Array(length).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
      .map((x: string) => x[Math.floor(Math.random() * x.length)]).join('')
  }

  public static email (): string {
    return `${Random.string(10)}@${Random.string(6)}.${Random.string(3)}`.toLowerCase()
  }
}
