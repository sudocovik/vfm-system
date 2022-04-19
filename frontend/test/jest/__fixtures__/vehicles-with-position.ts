import type { TraccarDevice, TraccarPosition } from 'src/backend/VehicleService'

export type VehicleWithPositionExpectations = {
  vehicleId: number
  licensePlate: string
  imei: string
  isOnline: boolean
  isOffline: boolean
  latitude: number
  longitude: number
  altitude: number
  speed: number
  course: number
  address: string
  fixationTime: Date
}

export type VehicleWithPositionMock = {
  vehicle: TraccarDevice
  position: TraccarPosition
  expectations: VehicleWithPositionExpectations
}

export const firstVehicle = (): VehicleWithPositionMock => {
  const vehicleId = 1
  const positionId = 1

  return {
    vehicle: {
      id: vehicleId,
      name: 'ZD456BC',
      uniqueId: '424232564',
      status: 'offline',
      disabled: false,
      lastUpdate: null,
      positionId: positionId,
      groupId: null,
      phone: '',
      model: '',
      contact: '',
      category: null,
      geofenceIds: [],
      attributes: {}
    },
    position: {
      id: positionId,
      deviceId: vehicleId,
      protocol: 'teltonika',
      fixTime: '2022-03-16T16:39:00.000+00:00',
      deviceTime: '2022-03-16T16:39:01.000+00:00',
      serverTime: '2022-03-16T16:39:05.000+00:00',
      outdated: false,
      valid: true,
      latitude: 44.0901797,
      longitude: 15.2176099,
      altitude: 30,
      speed: 15,
      course: 270,
      address: 'My street 1',
      accuracy: 0,
      network: {},
      attributes: {}
    },
    expectations: {
      vehicleId,
      licensePlate: 'ZD456BC',
      imei: '424232564',
      isOnline: false,
      isOffline: true,
      latitude: 44.0901797,
      longitude: 15.2176099,
      altitude: 30,
      speed: 28,
      course: 270,
      address: 'My street 1',
      fixationTime: new Date(2022, 2, 16, 16, 39, 0, 0)
    }
  }
}

export const vehiclesWithPositions = [firstVehicle()]
