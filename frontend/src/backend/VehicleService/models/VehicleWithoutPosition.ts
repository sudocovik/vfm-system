export class VehicleWithoutPosition {
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
    return false
  }

  public isOffline (): boolean {
    return true
  }
}
