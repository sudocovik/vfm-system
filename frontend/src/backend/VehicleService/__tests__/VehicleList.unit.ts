import { describe, expect, it } from '@jest/globals'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import {
  GeoLocatedVehicle,
  PositionList,
  TraccarDevice,
  VehicleList,
  VehicleWithoutPosition
} from 'src/backend/VehicleService'
import { vehiclesWithoutPosition } from '../__fixtures__/vehicles-without-position'
import {
  vehiclesWithPositions,
  VehicleWithPositionExpectations,
  VehicleWithPositionFixture
} from '../__fixtures__/vehicles-with-position'
import { PositionFixture, positionFixtures } from '../__fixtures__/positions'

const axiosMock = new MockAdapter(axios)

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
      simulateUserHasVehiclesWithoutPosition([expectedVehicle])

      const vehicles = await vehicleList.fetchAllWithoutPositions()
      const actualVehicle = vehicles[0]

      expect(vehicles).toHaveLength(1)
      validateVehicleWithoutPosition(actualVehicle, expectedVehicle)
    })

    it('should return multiple vehicles in array if user has multiple devices', async () => {
      simulateUserHasVehiclesWithoutPosition(vehiclesWithoutPosition)

      const vehicles = await vehicleList.fetchAllWithoutPositions()

      expect(vehicles).toHaveLength(vehicles.length)
      vehicles.forEach((vehicle, i) => validateVehicleWithoutPosition(vehicle, vehiclesWithoutPosition[i]))
    })
  })

  describe('fetchAll', () => {
    it('should return empty array if user has zero vehicles', async () => {
      simulateUserHasNoVehicles()

      const vehicles = await vehicleList.fetchAll()

      expect(vehicles).toBeInstanceOf(Array)
      expect(vehicles).toHaveLength(0)
    })

    it('should return empty array if user has zero vehicles but has some positions', async () => {
      // This is a behaviour which should never happen in production
      // but having extra checks does not cost anything significant
      simulateNoVehiclesButManyPositions(positionFixtures)

      const vehicles = await vehicleList.fetchAll()

      expect(vehicles).toBeInstanceOf(Array)
      expect(vehicles).toHaveLength(0)
    })

    it.each(vehiclesWithPositions)('should return single vehicle with position if user has single vehicle which works properly', async (expectedVehicle: VehicleWithPositionFixture) => {
      simulateUserHasVehiclesWithPositions([expectedVehicle])

      const vehicles = await vehicleList.fetchAll()
      const actualVehicle = vehicles[0]

      validateGeoLocatedVehicle(actualVehicle, expectedVehicle.expectations)
    })

    it('should return two vehicles with their position if user has two vehicles working properly', async () => {
      const [first, second] = vehiclesWithPositions
      simulateUserHasVehiclesWithPositions([first, second])

      const vehicles = await vehicleList.fetchAll()

      expect(vehicles).toHaveLength(2)
      validateGeoLocatedVehicle(vehicles[0], first.expectations)
      validateGeoLocatedVehicle(vehicles[1], second.expectations)
    })
  })
})

function simulateUserHasNoVehicles () {
  axiosMock.onGet(VehicleList.vehicleEndpoint).reply(200, [])
  axiosMock.onGet(PositionList.positionEndpoint).reply(200, [])
}

function simulateUserHasVehiclesWithoutPosition (vehicles: TraccarDevice[]) {
  axiosMock.onGet(VehicleList.vehicleEndpoint).reply(200, vehicles)
}

function validateVehicleWithoutPosition (actualVehicle: VehicleWithoutPosition, expectedVehicle: TraccarDevice) {
  expect(actualVehicle).toBeInstanceOf(VehicleWithoutPosition)
  expect(actualVehicle.id()).toEqual(expectedVehicle.id)
  expect(actualVehicle.licensePlate()).toEqual(expectedVehicle.name)
  expect(actualVehicle.imei()).toEqual(expectedVehicle.uniqueId)
  expect(actualVehicle.isOnline()).toEqual(expectedVehicle.status === 'online')
  expect(actualVehicle.isOffline()).toEqual(expectedVehicle.status === 'offline')
}

function simulateNoVehiclesButManyPositions (positions: PositionFixture[]) {
  axiosMock.onGet(VehicleList.vehicleEndpoint).reply(200, [])
  axiosMock.onGet(PositionList.positionEndpoint).reply(200, positions.map(({ position }) => position))
}

function simulateUserHasVehiclesWithPositions (vehiclesWithPosition: VehicleWithPositionFixture[]) {
  const vehicles = vehiclesWithPosition.map(({ vehicle }) => vehicle)
  const positions = vehiclesWithPosition.map(({ position }) => position)

  axiosMock.onGet(VehicleList.vehicleEndpoint).reply(200, vehicles)
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
