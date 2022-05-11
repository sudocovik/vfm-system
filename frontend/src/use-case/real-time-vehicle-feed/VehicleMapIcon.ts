export const size = 32
export const radius = size / 2
export const centerX = radius
export const centerY = radius
export const stopIndicatorSize = 12
export const stopIndicatorCenter = radius - (stopIndicatorSize / 2)

export const colors = {
  yellow: {
    stroke: '#d78200',
    fill: '#ff9a00'
  },
  green: {
    stroke: '#00a706',
    fill: '#00cc07'
  }
}

const createDirectionArrow = (fillColor: string, strokeColor: string) =>
`<path data-cy="direction-arrow"
  fill="${fillColor}"
  stroke="${strokeColor}"
  stroke-width="1"
  d="M20 20.725a.94.94 0 0 1-.55-.17l-6.9-4.56a1 1 0 0 0-1.1 0l-6.9 4.56a1 1 0 0 1-1.44-1.28l8-16a1 1 0 0 1 1.78 0l8 16a1 1 0 0 1-.23 1.2A1 1 0 0 1 20 20.725z"
  transform="translate(4, 3)"
/>`

const createStopIndicator = (fillColor: string, strokeColor: string) =>
`<rect data-cy="stop-indicator"
  fill="${fillColor}"
  stroke="${strokeColor}"
  stroke-width="1"
  width="${stopIndicatorSize}"
  height="${stopIndicatorSize}"
  x="${stopIndicatorCenter}"
  y="${stopIndicatorCenter}"
/>`

export function createIcon (moving = false, ignition = false, rotationInDegrees = 0): string {
  const rotation = moving ? rotationInDegrees : 0
  const { stroke, fill } = colors[ignition ? 'green' : 'yellow']

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
    <g data-cy="rotation-group" transform="rotate(${rotation} ${radius} ${radius})">
        <circle cx="${centerX}" cy="${centerY}" data-cy="background-stroke" r="${radius}" fill="#aaaaaa" />
        <circle cx="${centerX}" cy="${centerY}" data-cy="background-fill" r="${radius - 1}" fill="#ebebeb" />

        ${moving ? createDirectionArrow(fill, stroke) : createStopIndicator(fill, stroke)}
    </g>
</svg>`
}
