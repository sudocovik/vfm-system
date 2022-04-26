import { MapIcon } from './Interface'
import { CustomError } from 'ts-custom-error'

export class SVG implements MapIcon {
  private _width: number | null = null
  private _height: number | null = null

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

  public havingHeight (pixels: number): SVG {
    this._height = pixels

    return this
  }

  public height (): number {
    if (this._height === null) throw new SVGHeightNotSet()

    return this._height
  }
}

export class SVGWidthNotSet extends CustomError {
  public message = 'SVG width has not been set. Use method havingWidth() to set width.'
}

export class SVGHeightNotSet extends CustomError {
  public message = 'SVG height has not been set. Use method havingHeight() to set height.'
}
