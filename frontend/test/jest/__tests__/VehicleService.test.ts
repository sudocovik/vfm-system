import { describe, expect, it } from '@jest/globals'
import { TraccarDevice, VehicleList, VehicleWithoutPosition } from 'src/backend/VehicleService'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

describe('VehicleService', () => {
  describe('VehicleList', () => {
    const vehicleList = new VehicleList()

    describe('fetchAllWithoutPositions', () => {
      it('should return empty array if user has no vehicles', async () => {
        simulateUserHasNoVehicles()
        const vehiclesWithoutPosition = await vehicleList.fetchAllWithoutPositions()

        expect(vehiclesWithoutPosition).toBeInstanceOf(Array)
        expect(vehiclesWithoutPosition).toHaveLength(0)
      })

      it('should return single vehicle in array if user has only one device', async () => {
        simulateUserHasVehicles([
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
          }
        ])

        const vehiclesWithoutPosition = await vehicleList.fetchAllWithoutPositions()
        const vehicle = vehiclesWithoutPosition[0]

        expect(vehiclesWithoutPosition).toHaveLength(1)

        expect(vehicle).toBeInstanceOf(VehicleWithoutPosition)
        expect(vehicle.id()).toEqual(1)
        expect(vehicle.licensePlate()).toEqual('ZD123AB')
        expect(vehicle.imei()).toEqual('123456789')
        expect(vehicle.isOnline()).toEqual(false)
        expect(vehicle.isOffline()).toEqual(true)
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
