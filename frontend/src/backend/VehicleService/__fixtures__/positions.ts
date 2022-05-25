import { TraccarPosition } from '../response-schema'
import { Speed } from 'src/support/measurement-units/speed'

export interface PositionExpectations {
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

export type PositionFixture = {
  position: TraccarPosition
  expectations: PositionExpectations
}

export const firstPosition = (vehicleId = 1): PositionFixture => ({
  position: {
    id: 1,
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
    id: 1,
    vehicleId,
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
})

export const secondPosition = (vehicleId = 2): PositionFixture => ({
  position: {
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
  expectations: {
    id: 2,
    vehicleId,
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
})

export const positionFixtures = [firstPosition(), secondPosition()]
