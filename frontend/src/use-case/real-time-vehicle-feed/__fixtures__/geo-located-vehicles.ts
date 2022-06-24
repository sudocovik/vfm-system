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

export const secondGeoLocatedVehicle = new GeoLocatedVehicle(
  2,
  'ZD-111-BB',
  '987654321',
  false,
  new Position(
    2,
    2,
    41.67,
    12.88,
    5,
    60,
    Speed.fromKph(0),
    'Test address',
    false,
    false,
    '2022-01-01 1:00:00',
    '2022-01-01 1:00:00',
    '2022-01-01 1:00:00'
  )
)

export const updatedFirstGeoLocatedVehicle = new GeoLocatedVehicle(
  1,
  'ZD-000-AA',
  '123456789',
  true,
  new Position(
    3,
    1,
    44.40,
    15.41,
    120,
    60,
    Speed.fromKph(60),
    'Test address 1',
    true,
    true,
    '2022-01-01 0:01:00',
    '2022-01-01 0:01:00',
    '2022-01-01 0:01:00'
  )
)

export const updatedSecondGeoLocatedVehicle = new GeoLocatedVehicle(
  2,
  'ZD-111-BC',
  '98765432100',
  true,
  new Position(
    4,
    2,
    41.95,
    12.91,
    15,
    50,
    Speed.fromKph(1),
    'Test address 2',
    true,
    true,
    '2022-01-01 1:01:00',
    '2022-01-01 1:01:00',
    '2022-01-01 1:01:00'
  )
)

export const thirdGeoLocatedVehicle = new GeoLocatedVehicle(
  3,
  'ZD-222-CC',
  '81201230',
  false,
  new Position(
    5,
    3,
    43.985,
    16.7293,
    33,
    18,
    Speed.fromKph(125),
    'Test address 3',
    true,
    true,
    '2022-01-01 2:00:00',
    '2022-01-01 2:00:00',
    '2022-01-01 2:00:00'
  )
)
