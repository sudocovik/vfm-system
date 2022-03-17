import { describe, expect, it } from '@jest/globals'
import { TraccarDevice, VehicleList, VehicleWithoutPosition } from 'src/backend/VehicleService'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

describe('VehicleService', () => {
  describe('VehicleList', () => {
    const vehicleList = new VehicleList()
    const vehicles = [
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

      it.each(vehicles)('should return single vehicle in array if user has only one device (Index: %#)', async (expectedVehicle: TraccarDevice) => {
        simulateUserHasVehicles([expectedVehicle])

        const vehiclesWithoutPosition = await vehicleList.fetchAllWithoutPositions()
        const actualVehicle = vehiclesWithoutPosition[0]

        expect(vehiclesWithoutPosition).toHaveLength(1)

        expect(actualVehicle).toBeInstanceOf(VehicleWithoutPosition)
        expect(actualVehicle.id()).toEqual(expectedVehicle.id)
        expect(actualVehicle.licensePlate()).toEqual(expectedVehicle.name)
        expect(actualVehicle.imei()).toEqual(expectedVehicle.uniqueId)
        expect(actualVehicle.isOnline()).toEqual(expectedVehicle.status === 'online')
        expect(actualVehicle.isOffline()).toEqual(expectedVehicle.status === 'offline')
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
