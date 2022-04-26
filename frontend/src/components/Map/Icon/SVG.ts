import { MapIcon } from './Interface'
import { CustomError } from 'ts-custom-error'

export class SVG implements MapIcon {
  private _width: number | null = null

  public constructor (private _template: string) {}

  public toUrl (): string {
    return 'data:image/svg+xml,' + this.encodedTemplate()
  }

  private encodedTemplate (): string {
    return encodeURIComponent(this._template)
  }

  public havingWidth (pixels: number): SVG {
    this._width = pixels

    return this
  }

  public width (): number {
    if (this._width === null) throw new SVGWidthNotSet()

    return this._width
  }
}

export class SVGWidthNotSet extends CustomError {
  public message = 'SVG width has not been set. Use method havingWidth() to set width.'
}
