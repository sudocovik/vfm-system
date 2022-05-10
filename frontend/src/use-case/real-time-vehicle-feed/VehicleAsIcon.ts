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

export function createVehicleIcon (moving = false, ignition = false, rotation = 0): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <g data-cy="rotation-group" transform="rotate(${moving ? rotation : 0} 16 16)">
        <circle cx="16" cy="16" data-cy="background-stroke" r="16" fill="#aaaaaa" />
        <circle cx="16" cy="16" data-cy="background-fill" r="15" fill="#ebebeb" />

        ${moving ? `<path data-cy="direction-arrow"
stroke="${colors[ignition ? 'green' : 'yellow'].stroke}"
stroke-width="1"
fill="${colors[ignition ? 'green' : 'yellow'].fill}"
d="M20 20.725a.94.94 0 0 1-.55-.17l-6.9-4.56a1 1 0 0 0-1.1 0l-6.9 4.56a1 1 0 0 1-1.44-1.28l8-16a1 1 0 0 1 1.78 0l8 16a1 1 0 0 1-.23 1.2A1 1 0 0 1 20 20.725z"
transform="translate(4, 3)"
/>` : `<rect data-cy="stop-indicator"
stroke="${colors[ignition ? 'green' : 'yellow'].stroke}"
stroke-width="1"
fill="${colors[ignition ? 'green' : 'yellow'].fill}"
width="12"
height="12"
x="10"
y="10"
/>`}
    </g>
</svg>`
}
