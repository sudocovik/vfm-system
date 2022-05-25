import { describe, expect, it } from '@jest/globals'
import {
  GeoLocatedVehicle,
  PositionList,
  TraccarDevice,
  TraccarPosition,
  VehicleList,
  VehicleWithoutPosition
} from 'src/backend/VehicleService'
import { vehiclesWithoutPosition } from '../__fixtures__/vehicles-without-position'
import {
  vehiclesWithPositions,
  VehicleWithPositionExpectations,
  VehicleWithPositionFixture
} from '../__fixtures__/vehicles-with-position'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { Speed } from 'src/support/measurement-units/speed'

interface ExpectedPosition {
  id: number
  vehicleId: number
  latitude: number
  longitude: number
  altitude: number
  speed: Speed
  course: number
  address: string
  fixationTime: Date
  sentTime: Date
  receivedTime: Date
}

const rawPositions: ({ raw: TraccarPosition, expected: ExpectedPosition })[] = [
  {
    raw: {
      id: 1,
      deviceId: 1,
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
    expected: {
      id: 1,
      vehicleId: 1,
      latitude: 44.0901797,
      longitude: 15.2176099,
      altitude: 30,
      speed: Speed.fromKnots(15),
      course: 270,
      address: 'My street 1',
      fixationTime: new Date(2022, 2, 16, 16, 39, 0, 0),
      sentTime: new Date(2022, 2, 16, 16, 39, 1, 0),
      receivedTime: new Date(2022, 2, 16, 16, 39, 5, 0)
    }
  },
  {
    raw: {
      id: 2,
      deviceId: 2,
      protocol: 'teltonika',
      fixTime: '2022-04-12T12:02:02.000+00:00',
      deviceTime: '2022-04-12T12:02:05.000+00:00',
      serverTime: '2022-04-12T12:02:07.000+00:00',
      outdated: false,
      valid: true,
      latitude: 44.11660,
      longitude: 15.27059,
      altitude: 70,
      speed: 90,
      course: 17,
      address: 'Your street 1',
      accuracy: 0,
      network: {},
      attributes: {}
    },
    expected: {
      id: 2,
      vehicleId: 2,
      latitude: 44.11660,
      longitude: 15.27059,
      altitude: 70,
      speed: Speed.fromKnots(90),
      course: 17,
      address: 'Your street 1',
      fixationTime: new Date(2022, 3, 12, 12, 2, 2, 0),
      sentTime: new Date(2022, 3, 12, 12, 2, 5, 0),
      receivedTime: new Date(2022, 3, 12, 12, 2, 7, 0)
    }
  }
]

describe('VehicleService', () => {
  describe('VehicleList', () => {
    const vehicleList = new VehicleList()

    describe('fetchAllWithoutPositions', () => {
      it('should return empty array if user has no vehiclesWithoutPosition', async () => {
        simulateUserHasNoVehicles()
        const vehicles = await vehicleList.fetchAllWithoutPositions()

        expect(vehicles).toBeInstanceOf(Array)
        expect(vehicles).toHaveLength(0)
      })

      it.each(vehiclesWithoutPosition)('should return single vehicle in array if user has only one device (Index: %#)', async (expectedVehicle: TraccarDevice) => {
        simulateUserHasVehicles([expectedVehicle])

        const vehicles = await vehicleList.fetchAllWithoutPositions()
        const actualVehicle = vehicles[0]

        expect(vehicles).toHaveLength(1)
        vehicleShouldEqualTraccarDevice(actualVehicle, expectedVehicle)
      })

      it('should return multiple vehicles in array if user has multiple devices', async () => {
        simulateUserHasVehicles(vehiclesWithoutPosition)

        const vehicles = await vehicleList.fetchAllWithoutPositions()

        expect(vehicles).toHaveLength(vehicles.length)
        vehicles.forEach((vehicle, i) => vehicleShouldEqualTraccarDevice(vehicle, vehiclesWithoutPosition[i]))
      })
    })

    describe('fetchAll', () => {
      it('should return empty array if user has zero vehicles', async () => {
        simulateUserHasNoVehicles()
        simulateNoPositions()

        const vehicles = await vehicleList.fetchAll()

        expect(vehicles).toBeInstanceOf(Array)
        expect(vehicles).toHaveLength(0)
      })

      it('should return empty array if user has zero vehicles but has some positions', async () => {
        // This is a behaviour which should never happen in production
        // but having extra checks does not cost anything significant
        simulateUserHasNoVehicles()
        simulateManyPositions(rawPositions.map(({ raw }) => raw))

        const vehicles = await vehicleList.fetchAll()

        expect(vehicles).toBeInstanceOf(Array)
        expect(vehicles).toHaveLength(0)
      })

      it.each(vehiclesWithPositions)('should return single vehicle with position if user has single vehicle which works properly', async (vehicleMock: VehicleWithPositionFixture) => {
        const { vehicle, position, expectations } = vehicleMock

        simulateUserHasVehicles([vehicle])
        simulateManyPositions([position])

        const vehicles = await vehicleList.fetchAll()
        const actualVehicle = vehicles[0]

        validateGeoLocatedVehicle(actualVehicle, expectations)
      })

      it('should return two vehicles with their position if user has two vehicles working properly', async () => {
        const [first, second] = vehiclesWithPositions
        const { vehicle: firstVehicle, position: firstPosition, expectations: firstExpectations } = first
        const { vehicle: secondVehicle, position: secondPosition, expectations: secondExpectations } = second

        simulateUserHasVehicles([firstVehicle, secondVehicle])
        simulateManyPositions([firstPosition, secondPosition])

        const vehicles = await vehicleList.fetchAll()

        expect(vehicles).toHaveLength(2)
        validateGeoLocatedVehicle(vehicles[0], firstExpectations)
        validateGeoLocatedVehicle(vehicles[1], secondExpectations)
      })
    })
  })
})

const axiosMock = new MockAdapter(axios)
function simulateUserHasNoVehicles () {
  axiosMock.onGet(VehicleList.vehicleEndpoint).reply(200, [])
}

function simulateUserHasVehicles (vehicles: TraccarDevice[]) {
  axiosMock.onGet(VehicleList.vehicleEndpoint).reply(200, vehicles)
}

function vehicleShouldEqualTraccarDevice (actualVehicle: VehicleWithoutPosition, expectedVehicle: TraccarDevice) {
  expect(actualVehicle).toBeInstanceOf(VehicleWithoutPosition)
  expect(actualVehicle.id()).toEqual(expectedVehicle.id)
  expect(actualVehicle.licensePlate()).toEqual(expectedVehicle.name)
  expect(actualVehicle.imei()).toEqual(expectedVehicle.uniqueId)
  expect(actualVehicle.isOnline()).toEqual(expectedVehicle.status === 'online')
  expect(actualVehicle.isOffline()).toEqual(expectedVehicle.status === 'offline')
}

function simulateNoPositions () {
  axiosMock.onGet(PositionList.positionEndpoint).reply(200, [])
}

function simulateManyPositions (positions: TraccarPosition[]) {
  axiosMock.onGet(PositionList.positionEndpoint).reply(200, positions)
}

function validateGeoLocatedVehicle (vehicle: GeoLocatedVehicle, expectations: VehicleWithPositionExpectations) {
  expect(vehicle).toBeInstanceOf(GeoLocatedVehicle)
  expect(vehicle.id()).toEqual(expectations.vehicleId)
  expect(vehicle.licensePlate()).toEqual(expectations.licensePlate)
  expect(vehicle.imei()).toEqual(expectations.imei)
  expect(vehicle.isOnline()).toEqual(expectations.isOnline)
  expect(vehicle.isOffline()).toEqual(expectations.isOffline)
  expect(vehicle.latitude()).toEqual(expectations.latitude)
  expect(vehicle.longitude()).toEqual(expectations.longitude)
  expect(vehicle.altitude()).toEqual(expectations.altitude)
  expect(vehicle.speed().toKnots()).toEqual(expectations.speed.toKnots())
  expect(vehicle.course()).toEqual(expectations.course)
  expect(vehicle.address()).toEqual(expectations.address)
  expect(vehicle.fixationTime()).toEqual(expectations.fixationTime)
}
