import { describe, expect, it } from '@jest/globals'
import {
  Position,
  PositionList,
  TraccarDevice,
  TraccarPosition,
  VehicleList,
  VehicleWithoutPosition
} from 'src/backend/VehicleService'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { parseISO } from 'date-fns'

describe('VehicleService', () => {
  describe('VehicleList', () => {
    const vehicleList = new VehicleList()
    const rawVehicles = [
      {
        id: 1,
        name: 'ZD123AB',
        uniqueId: '123456789',
        status: 'offline',
        disabled: false,
        lastUpdate: null,
        positionId: null,
        groupId: null,
        phone: '',
        model: '',
        contact: '',
        category: null,
        geofenceIds: [],
        attributes: {}
      }, {
        id: 2,
        name: 'ZD321BA',
        uniqueId: '987654321',
        status: 'online',
        disabled: false,
        lastUpdate: null,
        positionId: null,
        groupId: null,
        phone: '',
        model: '',
        contact: '',
        category: null,
        geofenceIds: [],
        attributes: {}
      }
    ]

    describe('fetchAllWithoutPositions', () => {
      it('should return empty array if user has no vehicles', async () => {
        simulateUserHasNoVehicles()
        const vehiclesWithoutPosition = await vehicleList.fetchAllWithoutPositions()

        expect(vehiclesWithoutPosition).toBeInstanceOf(Array)
        expect(vehiclesWithoutPosition).toHaveLength(0)
      })

      it.each(rawVehicles)('should return single vehicle in array if user has only one device (Index: %#)', async (expectedVehicle: TraccarDevice) => {
        simulateUserHasVehicles([expectedVehicle])

        const vehiclesWithoutPosition = await vehicleList.fetchAllWithoutPositions()
        const actualVehicle = vehiclesWithoutPosition[0]

        expect(vehiclesWithoutPosition).toHaveLength(1)

        vehicleShouldEqualTraccarDevice(actualVehicle, expectedVehicle)
      })

      it('should return multiple vehicles in array if user has multiple devices', async () => {
        simulateUserHasVehicles(rawVehicles)

        const vehiclesWithoutPosition = await vehicleList.fetchAllWithoutPositions()

        expect(vehiclesWithoutPosition).toHaveLength(rawVehicles.length)

        vehiclesWithoutPosition.forEach((vehicle, i) => vehicleShouldEqualTraccarDevice(vehicle, rawVehicles[i]))
      })
    })
  })

  describe('PositionList', () => {
    const positionList = new PositionList()

    describe('fetchAllMostRecent', () => {
      it('should return empty array if no vehicle has sent it\'s position', async () => {
        simulateNoPositions()
        const allPosition = await positionList.fetchAllMostRecent()

        expect(allPosition).toBeInstanceOf(Array)
        expect(allPosition).toHaveLength(0)
      })

      it('should return single position in array if only one vehicle has sent it\'s position', async () => {
        const rawPosition = {
          id: 1,
          deviceId: 1,
          protocol: 'teltonika',
          deviceTime: '2022-03-16T16:39:01.000+00:00',
          fixTime: '2022-03-16T16:39:00.000+00:00',
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
        }
        simulateManyPositions([rawPosition])

        const allPositions = await positionList.fetchAllMostRecent()
        const position = allPositions[0]

        expect(allPositions).toHaveLength(1)

        positionShouldEqualTraccarPosition(position, rawPosition)
      })
    })
  })
})

function simulateUserHasNoVehicles () {
  const mock = new MockAdapter(axios)
  mock.onGet(VehicleList.vehicleEndpoint).reply(200, [])
}

function simulateUserHasVehicles (vehicles: TraccarDevice[]) {
  const mock = new MockAdapter(axios)
  mock.onGet(VehicleList.vehicleEndpoint).reply(200, vehicles)
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
  const mock = new MockAdapter(axios)
  mock.onGet(PositionList.positionEndpoint).reply(200, [])
}

function simulateManyPositions (positions: TraccarPosition[]) {
  const mock = new MockAdapter(axios)
  mock.onGet(PositionList.positionEndpoint).reply(200, positions)
}

function positionShouldEqualTraccarPosition (position: Position, expectedPosition: TraccarPosition) {
  expect(position).toBeInstanceOf(Position)
  expect(position.id()).toEqual(expectedPosition.id)
  expect(position.vehicleId()).toEqual(expectedPosition.deviceId)
  expect(position.latitude()).toEqual(expectedPosition.latitude)
  expect(position.longitude()).toEqual(expectedPosition.longitude)
  expect(position.course()).toEqual(expectedPosition.course)
  expect(position.speed()).toEqual(Math.round(expectedPosition.speed * 1.852))
  expect(position.altitude()).toEqual(expectedPosition.altitude)
  expect(position.address()).toEqual(expectedPosition.address)
  expect(position.fixationTime().getTime()).toEqual(parseISO(expectedPosition.fixTime).getTime())
  expect(position.sentTime().getTime()).toEqual(parseISO(expectedPosition.deviceTime).getTime())
  expect(position.receivedTime().getTime()).toEqual(parseISO(expectedPosition.serverTime).getTime())
}
