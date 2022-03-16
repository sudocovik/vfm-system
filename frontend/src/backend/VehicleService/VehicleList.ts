import { VehicleWithoutPosition } from './models/VehicleWithoutPosition'
import axios from 'axios'

export class VehicleList {
  public static vehicleEndpoint = '/api/devices'

  public async fetchAllWithoutPositions (): Promise<VehicleWithoutPosition[]> {
    const response = await axios.get(VehicleList.vehicleEndpoint)
    const vehicles = response.data as unknown[]

    return vehicles?.length === 0 ? [] : [
      new VehicleWithoutPosition()
    ]
  }
}
