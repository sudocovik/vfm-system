import { parseISO } from 'date-fns'

export class Position {
  public constructor (
    private _id: number,
    private _vehicleId: number,
    private _latitude: number,
    private _longitude: number,
    private _altitude: number,
    private _course: number,
    private _speed: number,
    private _address: string,
    private _fixationTime: string,
    private _sentTime: string,
    private _receivedTime: string
  ) {
  }

  public id (): number {
    return this._id
  }

  public vehicleId (): number {
    return this._vehicleId
  }

  public latitude (): number {
    return this._latitude
  }

  public longitude (): number {
    return this._longitude
  }

  public altitude (): number {
    return this._altitude
  }

  public course (): number {
    return this._course
  }

  public speed (): number {
    return Math.round(this._speed * 1.852)
  }

  public address (): string {
    return this._address
  }

  public fixationTime (): Date {
    return parseISO(this._fixationTime)
  }

  public sentTime (): Date {
    return parseISO(this._sentTime)
  }

  public receivedTime (): Date {
    return parseISO(this._receivedTime)
  }
}
