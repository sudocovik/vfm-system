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

interface ExpectedPosition {
  id: number
  vehicleId: number
  latitude: number
  longitude: number
  altitude: number
  speed: number
  course: number
  address: string
  fixationTime: Date
  sentTime: Date
  receivedTime: Date
}

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
          speed: 28,
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
          speed: 167,
          course: 17,
          address: 'Your street 1',
          fixationTime: new Date(2022, 3, 12, 12, 2, 2, 0),
          sentTime: new Date(2022, 3, 12, 12, 2, 5, 0),
          receivedTime: new Date(2022, 3, 12, 12, 2, 7, 0)
        }
      }
    ]

    describe('fetchAllMostRecent', () => {
      it('should return empty array if no vehicle has sent it\'s position', async () => {
        simulateNoPositions()
        const allPositions = await positionList.fetchAllMostRecent()

        expect(allPositions).toBeInstanceOf(Array)
        expect(allPositions).toHaveLength(0)
      })

      it.each(rawPositions)('should return single position in array if only one vehicle has sent it\'s position (Index: %#)', async ({ raw, expected }) => {
        simulateManyPositions([raw])

        const allPositions = await positionList.fetchAllMostRecent()
        const position = allPositions[0]

        expect(allPositions).toHaveLength(1)

        positionShouldEqualTraccarPosition(position, expected)
      })

      it('should return multiple positions in array if multiple devices sent their positions', async () => {
        const rawBackendPositions = rawPositions.map(({ raw }) => raw)
        const rawExpectedPositions = rawPositions.map(({ expected }) => expected)
        simulateManyPositions(rawBackendPositions)

        const allPositions = await positionList.fetchAllMostRecent()

        expect(allPositions).toHaveLength(rawBackendPositions.length)

        allPositions.forEach((position, i) => positionShouldEqualTraccarPosition(position, rawExpectedPositions[i]))
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

function positionShouldEqualTraccarPosition (position: Position, expectedPosition: ExpectedPosition) {
  expect(position).toBeInstanceOf(Position)
  expect(position.id()).toEqual(expectedPosition.id)
  expect(position.vehicleId()).toEqual(expectedPosition.vehicleId)
  expect(position.latitude()).toEqual(expectedPosition.latitude)
  expect(position.longitude()).toEqual(expectedPosition.longitude)
  expect(position.course()).toEqual(expectedPosition.course)
  expect(position.speed()).toEqual(expectedPosition.speed)
  expect(position.altitude()).toEqual(expectedPosition.altitude)
  expect(position.address()).toEqual(expectedPosition.address)
  expect(position.fixationTime()).toEqual(expectedPosition.fixationTime)
  expect(position.sentTime()).toEqual(expectedPosition.sentTime)
  expect(position.receivedTime()).toEqual(expectedPosition.receivedTime)
}
