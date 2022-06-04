import type { TraccarDevice, TraccarPosition } from 'src/backend/VehicleService'
import { Speed } from 'src/support/measurement-units/speed'

export type VehicleWithPositionExpectations = {
  vehicleId: number
  licensePlate: string
  imei: string
  isOnline: boolean
  isOffline: boolean
  latitude: number
  longitude: number
  altitude: number
  speed: Speed
  course: number
  address: string
  ignition: boolean
  moving: boolean
  fixationTime: Date
}

export type VehicleWithPositionFixture = {
  vehicle: TraccarDevice
  position: TraccarPosition
  expectations: VehicleWithPositionExpectations
}

export const firstVehicle = (): VehicleWithPositionFixture => {
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
      attributes: {
        ignition: true,
        motion: true
      }
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
      speed: Speed.fromKnots(15),
      course: 270,
      address: 'My street 1',
      ignition: true,
      moving: true,
      fixationTime: new Date(2022, 2, 16, 16, 39, 0, 0)
    }
  }
}

export const secondVehicle = (): VehicleWithPositionFixture => {
  const vehicleId = 2
  const positionId = 2

  return {
    vehicle: {
      id: vehicleId,
      name: 'ZD359AL',
      uniqueId: '0984129482',
      status: 'online',
      disabled: false,
      lastUpdate: null,
      positionId: positionId,
      groupId: null,
      phone: '',
      model: '',
      contact: '',
      category: null,
      geofenceIds: [],
      attributes: {
        ignition: false,
        motion: false
      }
    },
    position: {
      id: positionId,
      deviceId: vehicleId,
      protocol: 'teltonika',
      fixTime: '2022-04-19T13:59:00.000+00:00',
      deviceTime: '2022-04-19T14:00:01.000+00:00',
      serverTime: '2022-04-19T14:00:05.000+00:00',
      outdated: false,
      valid: true,
      latitude: 44.11689198,
      longitude: 15.2355778,
      altitude: 15,
      speed: 30,
      course: 30,
      address: 'Ulica Bana Josipa Jelačića, 23000 Zadar, HR',
      accuracy: 0,
      network: {},
      attributes: {}
    },
    expectations: {
      vehicleId,
      licensePlate: 'ZD359AL',
      imei: '0984129482',
      isOnline: true,
      isOffline: false,
      latitude: 44.11689198,
      longitude: 15.2355778,
      altitude: 15,
      speed: Speed.fromKnots(30),
      course: 30,
      address: 'Ulica Bana Josipa Jelačića, 23000 Zadar, HR',
      ignition: false,
      moving: false,
      fixationTime: new Date(2022, 3, 19, 13, 59, 0, 0)
    }
  }
}

export const vehiclesWithPositions = [firstVehicle(), secondVehicle()]
