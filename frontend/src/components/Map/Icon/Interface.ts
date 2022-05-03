export interface MapIcon {
  toUrl (): string
  havingWidth(pixels: number): MapIcon
  havingHeight(pixels: number): MapIcon
  width(): number
  height(): number
}
