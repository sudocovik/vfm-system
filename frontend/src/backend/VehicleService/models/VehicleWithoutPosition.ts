export class VehicleWithoutPosition {
  public constructor (
    private readonly _id: number,
    private readonly _licensePlate: string,
    private readonly _imei: string,
    private readonly _isOnline: boolean
  ) {}

  public id (): number {
    return this._id
  }

  public licensePlate (): string {
    return this._licensePlate
  }

  public imei (): string {
    return this._imei
  }

  public isOnline (): boolean {
    return this._isOnline
  }

  public isOffline (): boolean {
    return !this.isOnline()
  }
}
