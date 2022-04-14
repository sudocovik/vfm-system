import axios from 'axios'
import { VehicleWithoutPosition } from './models/VehicleWithoutPosition'
import { TraccarDevice } from './models/TraccarDevice'
import { GeoLocatedVehicle } from './models/GeoLocatedVehicle'

export class VehicleList {
  public static vehicleEndpoint = '/api/devices'

  public async fetchAllWithoutPositions (): Promise<VehicleWithoutPosition[]> {
    const response = await axios.get(VehicleList.vehicleEndpoint)
    const devices = response.data as TraccarDevice[]

    const convertDeviceToVehicle = (device: TraccarDevice) => new VehicleWithoutPosition(
      device.id,
      device.name,
      device.uniqueId,
      device.status === 'online'
    )

    return devices.map(convertDeviceToVehicle)
  }

  public async fetchAll (): Promise<GeoLocatedVehicle[]> {
    const vehicles = await this.fetchAllWithoutPositions()

    return vehicles.length === 0 ? [] : [new GeoLocatedVehicle()]
  }
}
