import axios from 'axios'
import { Position } from './models/'
import { TraccarPosition } from './response-schema/'
import { Speed } from 'src/support/measurement-units/speed'

export class PositionList {
  public static readonly positionEndpoint = '/api/positions'

  public static async fetchAllMostRecent (): Promise<Position[]> {
    const response = await axios.get(PositionList.positionEndpoint)
    const positions = response.data as TraccarPosition[]

    const convertToPosition = (position: TraccarPosition) => new Position(
      position.id,
      position.deviceId,
      position.latitude,
      position.longitude,
      position.altitude,
      position.course,
      Speed.fromKnots(position.speed),
      position.address,
      !!position.attributes.ignition,
      !!position.attributes.motion,
      position.fixTime,
      position.deviceTime,
      position.serverTime
    )

    return positions.map(convertToPosition)
  }
}
