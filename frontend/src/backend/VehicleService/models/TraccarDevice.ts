export interface TraccarDevice {
  id: number
  name: string
  uniqueId: string
  status: string
  disabled: boolean
  lastUpdate: string | null
  positionId: number | null
  groupId: number | null
  phone: string
  model: string
  contact: string
  category: string | null
  geofenceIds: number[]
  attributes: Record<string, unknown>
}
