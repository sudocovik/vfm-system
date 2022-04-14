export class GeoLocatedVehicle {
  public id (): number {
    return 1
  }

  public licensePlate (): string {
    return 'ZD123AB'
  }

  public imei (): string {
    return '123456789'
  }

  public isOnline (): boolean {
    return true
  }

  public isOffline (): boolean {
    return false
  }

  public latitude (): number {
    return 44.0901797
  }

  public longitude (): number {
    return 15.2176099
  }

  public altitude (): number {
    return 30
  }

  public speed (): number {
    return 28
  }

  public address (): string {
    return 'My street 1'
  }

  public fixationTime (): Date {
    return new Date(2022, 2, 16, 16, 39, 0, 0)
  }
}
