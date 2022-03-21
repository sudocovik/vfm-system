import { Position } from './models/Position'
import axios from 'axios'
import { TraccarPosition } from './models/TraccarPosition'

export class PositionList {
  public static readonly positionEndpoint = '/api/position'

  public async fetchAllMostRecent (): Promise<Position[]> {
    const response = await axios.get(PositionList.positionEndpoint)
    const positions = response.data as TraccarPosition[]

    return positions?.length === 0 ? [] : [new Position()]
  }
}
