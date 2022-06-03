import { GeoLocatedVehicle, Position } from 'src/backend/VehicleService'
import { Speed } from 'src/support/measurement-units/speed'

export const firstGeoLocatedVehicle = new GeoLocatedVehicle(
  1,
  'ZD-000-AA',
  '123456789',
  true,
  new Position(
    1,
    1,
    44.12,
    15.63,
    140,
    70,
    Speed.fromKph(50),
    'Test address',
    true,
    true,
    '2022-01-01 0:00:00',
    '2022-01-01 0:00:00',
    '2022-01-01 0:00:00'
  )
)
