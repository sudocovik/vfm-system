import { Position } from './Position'
import { Speed } from 'src/support/measurement-units/speed'

export class GeoLocatedVehicle {
  public constructor (
    private _id: number,
    private _licensePlate: string,
    private _imei: string,
    private _online: boolean,
    private _position: Position
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
    return this._online
  }

  public isOffline (): boolean {
    return !this.isOnline()
  }

  public latitude (): number {
    return this._position.latitude()
  }

  public longitude (): number {
    return this._position.longitude()
  }

  public altitude (): number {
    return this._position.altitude()
  }

  public course (): number {
    return this._position.course()
  }

  public speed (): Speed {
    return this._position.speed()
  }

  public address (): string {
    return this._position.address()
  }

  public fixationTime (): Date {
    return this._position.fixationTime()
  }
}
