export class Position {
  public id (): number {
    return 1
  }

  public vehicleId (): number {
    return 1
  }

  public latitude (): number {
    return 44.0901797
  }

  public longitude (): number {
    return 15.2176099
  }

  public course (): number {
    return 270
  }

  public speed (): number {
    return 28
  }

  public altitude (): number {
    return 30
  }

  public address (): string {
    return 'My street 1'
  }

  public fixationTime (): Date {
    return new Date(2022, 2, 16, 16, 39, 0)
  }

  public sentTime (): Date {
    return new Date(2022, 2, 16, 16, 39, 1)
  }

  public receivedTime (): Date {
    return new Date(2022, 2, 16, 16, 39, 5)
  }
}
