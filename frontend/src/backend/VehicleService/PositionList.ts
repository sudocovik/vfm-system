import { Position } from './models/Position'
import axios from 'axios'
import { TraccarPosition } from './models/TraccarPosition'

export class PositionList {
  public static readonly positionEndpoint = '/api/position'

  public async fetchAllMostRecent (): Promise<Position[]> {
    const response = await axios.get(PositionList.positionEndpoint)
    const positions = response.data as TraccarPosition[]

    const convertToPosition = (position: TraccarPosition) => new Position(
      position.id,
      position.deviceId,
      position.latitude,
      position.longitude,
      position.altitude,
      position.course,
      position.speed,
      position.address,
      position.fixTime,
      position.deviceTime,
      position.serverTime
    )

    return positions.map(convertToPosition)
  }
}
