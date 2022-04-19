import { Position } from './Position'

export class GeoLocatedVehicle {
  public constructor (
    private _id: number,
    private _licensePlate: string,
    private _imei: string,
    private _online: boolean,
    private _position: Position
  ) {
  }

  public id (): number {
    return this._id
  }

  public licensePlate (): string {
    return 'ZD456BC'
  }

  public imei (): string {
    return '424232564'
  }

  public isOnline (): boolean {
    return false
  }

  public isOffline (): boolean {
    return true
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

  public course (): number {
    return 270
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
