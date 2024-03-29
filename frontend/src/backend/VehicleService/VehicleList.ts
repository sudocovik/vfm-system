import axios from 'axios'
import { GeoLocatedVehicle, Position, VehicleWithoutPosition } from './models/'
import { PositionList } from './PositionList'
import { TraccarDevice } from './response-schema/'

export class VehicleList {
  public static vehicleEndpoint = '/api/devices'

  public static async fetchAllWithoutPositions (): Promise<VehicleWithoutPosition[]> {
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

  public static async fetchAll (): Promise<GeoLocatedVehicle[]> {
    const vehicles = await VehicleList.fetchAllWithoutPositions()
    const positions = await PositionList.fetchAllMostRecent()

    const vehicleWithPosition = (vehicle: VehicleWithoutPosition) => {
      const position = positions.find(position => position.vehicleId() === vehicle.id()) as Position

      return new GeoLocatedVehicle(
        vehicle.id(),
        vehicle.licensePlate(),
        vehicle.imei(),
        vehicle.isOnline(),
        position
      )
    }

    return vehicles.length === 0 ? [] : vehicles.map(vehicleWithPosition)
  }
}
