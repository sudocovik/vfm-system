import axios from 'axios'
import { VehicleWithoutPosition } from './models/VehicleWithoutPosition'
import { TraccarDevice } from './models/TraccarDevice'

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
}
