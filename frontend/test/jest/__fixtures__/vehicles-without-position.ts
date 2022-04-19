import { TraccarDevice } from 'src/backend/VehicleService'

export const firstVehicle: TraccarDevice = {
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

export const secondVehicle: TraccarDevice = {
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

export const vehiclesWithoutPosition: TraccarDevice[] = [firstVehicle, secondVehicle]
