import { MapIcon } from './Interface'

export class SVG implements MapIcon {
  public constructor (private _template: string) {}

  public toUrl (): string {
    return 'data:image/svg+xml,' + this.encodedTemplate()
  }

  private encodedTemplate (): string {
    return encodeURIComponent(this._template)
  }
}
