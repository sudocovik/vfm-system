export interface TraccarPosition {
  id: number
  deviceId: number
  protocol: string
  deviceTime: string
  fixTime: string
  serverTime: string
  outdated: boolean
  valid: boolean
  latitude: number
  longitude: number
  altitude: number
  speed: number
  course: number
  address: string
  accuracy: number | null
  network: Record<string, unknown>
  attributes: Record<string, unknown>
}
