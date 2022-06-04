import { describe, expect, it } from '@jest/globals'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { Position, PositionList, TraccarPosition } from 'src/backend/VehicleService'
import { PositionExpectations, PositionFixture, positionFixtures } from '../__fixtures__/positions'

describe('PositionList', () => {
  describe('fetchAllMostRecent', () => {
    it('should return empty array if no vehicle has sent it\'s position', async () => {
      simulateNoPositions()
      const allPositions = await PositionList.fetchAllMostRecent()

      expect(allPositions).toBeInstanceOf(Array)
      expect(allPositions).toHaveLength(0)
    })

    it.each(positionFixtures)('should return single position in array if only one vehicle has sent it\'s position (Index: %#)', async (fixture: PositionFixture) => {
      const { position: rawPosition, expectations } = fixture
      simulateManyPositions([rawPosition])

      const allPositions = await PositionList.fetchAllMostRecent()
      const position = allPositions[0]

      expect(allPositions).toHaveLength(1)
      validatePosition(position, expectations)
    })

    it('should return multiple positions in array if multiple devices sent their positions', async () => {
      const rawBackendPositions = positionFixtures.map(({ position }) => position)
      const rawExpectedPositions = positionFixtures.map(({ expectations }) => expectations)
      simulateManyPositions(rawBackendPositions)

      const allPositions = await PositionList.fetchAllMostRecent()

      expect(allPositions).toHaveLength(rawBackendPositions.length)

      allPositions.forEach((position, i) => validatePosition(position, rawExpectedPositions[i]))
    })

    describe('Ignition', function () {
      it('should be false if server sent no data about ignition', async () => {
        const missingIgnitionData = {}
        const mockedPosition = { ...positionFixtures[0].position, ...{ attributes: missingIgnitionData } }
        simulateManyPositions([mockedPosition])

        const position = (await PositionList.fetchAllMostRecent())[0]
        expect(position.ignition()).toEqual(false)
      })

      it('should be false if server said ignition is off', async () => {
        const ignitionOff = { ignition: false }
        const mockedPosition = { ...positionFixtures[0].position, ...{ attributes: ignitionOff } }
        simulateManyPositions([mockedPosition])

        const position = (await PositionList.fetchAllMostRecent())[0]
        expect(position.ignition()).toEqual(false)
      })

      it('should be true if server said ignition is on', async () => {
        const ignitionOn = { ignition: true }
        const mockedPosition = { ...positionFixtures[0].position, ...{ attributes: ignitionOn } }
        simulateManyPositions([mockedPosition])

        const position = (await PositionList.fetchAllMostRecent())[0]
        expect(position.ignition()).toEqual(true)
      })
    })

    describe('Moving', () => {
      it('should be false if server sent no data about motion status', async () => {
        const missingMotionData = {}
        const mockedPosition = { ...positionFixtures[0].position, ...{ attributes: missingMotionData } }
        simulateManyPositions([mockedPosition])

        const position = (await PositionList.fetchAllMostRecent())[0]
        expect(position.moving()).toEqual(false)
      })

      it('should be false if server said vehicle is stationary', async () => {
        const stationary = { motion: false }
        const mockedPosition = { ...positionFixtures[0].position, ...{ attributes: stationary } }
        simulateManyPositions([mockedPosition])

        const position = (await PositionList.fetchAllMostRecent())[0]
        expect(position.moving()).toEqual(false)
      })

      it('should be false if server said vehicle is moving', async () => {
        const moving = { motion: true }
        const mockedPosition = { ...positionFixtures[0].position, ...{ attributes: moving } }
        simulateManyPositions([mockedPosition])

        const position = (await PositionList.fetchAllMostRecent())[0]
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

function validatePosition (position: Position, expectedPosition: PositionExpectations) {
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
