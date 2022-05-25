import { describe, expect, it } from '@jest/globals'
import { PositionList } from '../PositionList'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { Speed } from 'src/support/measurement-units/speed'
import { TraccarPosition } from '../response-schema'
import { Position } from '../models'

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

describe('PositionList', () => {
  const positionList = new PositionList()

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

    describe('Ignition', function () {
      it('should be false if server sent no data about ignition', async () => {
        const missingIgnitionData = {}
        const mockedPosition = { ...rawPositions[0].raw, ...{ attributes: missingIgnitionData } }
        simulateManyPositions([mockedPosition])

        const position = (await positionList.fetchAllMostRecent())[0]
        expect(position.ignition()).toEqual(false)
      })

      it('should be false if server said ignition is off', async () => {
        const ignitionOff = { ignition: false }
        const mockedPosition = { ...rawPositions[0].raw, ...{ attributes: ignitionOff } }
        simulateManyPositions([mockedPosition])

        const position = (await positionList.fetchAllMostRecent())[0]
        expect(position.ignition()).toEqual(false)
      })

      it('should be true if server said ignition is on', async () => {
        const ignitionOn = { ignition: true }
        const mockedPosition = { ...rawPositions[0].raw, ...{ attributes: ignitionOn } }
        simulateManyPositions([mockedPosition])

        const position = (await positionList.fetchAllMostRecent())[0]
        expect(position.ignition()).toEqual(true)
      })
    })

    describe('Moving', () => {
      it('should be false if server sent no data about motion status', async () => {
        const missingMotionData = {}
        const mockedPosition = { ...rawPositions[0].raw, ...{ attributes: missingMotionData } }
        simulateManyPositions([mockedPosition])

        const position = (await positionList.fetchAllMostRecent())[0]
        expect(position.moving()).toEqual(false)
      })

      it('should be false if server said vehicle is stationary', async () => {
        const stationary = { moving: false }
        const mockedPosition = { ...rawPositions[0].raw, ...{ attributes: stationary } }
        simulateManyPositions([mockedPosition])

        const position = (await positionList.fetchAllMostRecent())[0]
        expect(position.moving()).toEqual(false)
      })

      it('should be false if server said vehicle is moving', async () => {
        const moving = { moving: true }
        const mockedPosition = { ...rawPositions[0].raw, ...{ attributes: moving } }
        simulateManyPositions([mockedPosition])

        const position = (await positionList.fetchAllMostRecent())[0]
        expect(position.moving()).toEqual(true)
      })
    })
  })
})

function simulateNoPositions () {
  new MockAdapter(axios).onGet(PositionList.positionEndpoint).reply(200, [])
}

function simulateManyPositions (positions: TraccarPosition[]) {
  new MockAdapter(axios).onGet(PositionList.positionEndpoint).reply(200, positions)
}

function positionShouldEqualTraccarPosition (position: Position, expectedPosition: ExpectedPosition) {
  expect(position).toBeInstanceOf(Position)
  expect(position.id()).toEqual(expectedPosition.id)
  expect(position.vehicleId()).toEqual(expectedPosition.vehicleId)
  expect(position.latitude()).toEqual(expectedPosition.latitude)
  expect(position.longitude()).toEqual(expectedPosition.longitude)
  expect(position.course()).toEqual(expectedPosition.course)
  expect(position.speed().toKnots()).toEqual(expectedPosition.speed.toKnots())
  expect(position.altitude()).toEqual(expectedPosition.altitude)
  expect(position.address()).toEqual(expectedPosition.address)
  expect(position.fixationTime()).toEqual(expectedPosition.fixationTime)
  expect(position.sentTime()).toEqual(expectedPosition.sentTime)
  expect(position.receivedTime()).toEqual(expectedPosition.receivedTime)
}