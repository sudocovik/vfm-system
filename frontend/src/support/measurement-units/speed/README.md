# Speed measurement units

The goal of this class is to abstract and centralize logic used to represent and convert speed between different units (like kph, mph, knots, ...).

## Usage
Import the module and use static constructor to instantiate new object in target unit (i.e. use `Speed.fromKnots()` if your speed is in knots).

To access the speed in the same unit use method `to<<unit-name>>()`. For example, use `toKnots()` if your initial value is in knots.

Converting to other units works in similar fashion.
If your initial speed was created `fromKnots()` you can convert to kilometers per hour with `toKph()`.

## Example

```typescript
const knots = Speed.fromKnots(20)
knots.toKph() // 37.04
knots.toKnots() // 20
```

## Available units
 - Knots
 - Kilometers per hour

## Extending
Before implementing following behaviors write the tests first.
Test cases are scoped per measurement unit so feel free to take a look at past tests.

1. Implement static constructor starting with `from` and use abbreviated unit name.
If your new measurement unit is Miles per hour name the constructor `fromMph`.
Static constructor accepts only one parameter (number).
The class constructor only accepts knots as value so make sure you convert the parameter from static constructor to knots.
2. Implement `to<<unit-name>>()` method which returns the speed as number in unit you are implementing.
This means you have to convert value in Knots to your unit.
Use Google to find out ratio.
As in static constructor, use abbreviated name of the unit.
For example `toMph()`.
3. Make sure you tested converting between all other units.
Most likely you will have green tests (if implementation and test specification is ok) because converting to other units is generic operation already implemented and tested.
