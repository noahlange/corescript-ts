import Graphics from './Graphics';
import Utils from './Utils';

/**
 * The sprite which covers the entire game screen.
 */
export default class ScreenSprite extends PIXI.Container {
  public static YEPWarned = false;

  public static warnYep() {
    if (!ScreenSprite.YEPWarned) {
      console.warn(
        'Deprecation warning. Please update YEP_CoreEngine. ScreenSprite is not a sprite, it has graphics inside.'
      );
      ScreenSprite.YEPWarned = true;
    }
  }

  protected _graphics: PIXI.Graphics = new PIXI.Graphics();
  protected _red: number = -1;
  protected _green: number = -1;
  protected _blue: number = -1;
  protected _colorText: string = '';

  constructor() {
    super();
    this.addChild(this._graphics);
    this.opacity = 0;
    this.setBlack();
  }

  /**
   * The opacity of the sprite (0 to 255).
   */
  get opacity(): number {
    return this.alpha * 255;
  }

  set opacity(value: number) {
    this.alpha = value.clamp(0, 255) / 255;
  }

  get anchor(): any {
    ScreenSprite.warnYep();
    this.scale.x = 1;
    this.scale.y = 1;
    return { x: 0, y: 0 };
  }

  set anchor(value: any) {
    this.alpha = value.clamp(0, 255) / 255;
  }

  get blendMode(): number {
    return this._graphics.blendMode;
  }
  set blendMode(value: number) {
    this._graphics.blendMode = value;
  }

  /**
   * Sets black to the color of the screen sprite.
   *
   * @method setBlack
   */
  public setBlack() {
    this.setColor(0, 0, 0);
  }

  /**
   * Sets white to the color of the screen sprite.
   *
   * @method setWhite
   */
  public setWhite() {
    this.setColor(255, 255, 255);
  }

  /**
   * Sets the color of the screen sprite by values.
   */
  public setColor(
    /** The red value in the range (0, 255) */
    r: number,
    /** The green value in the range (0, 255) */
    g: number,
    /** The blue value in the range (0, 255) */
    b: number
  ) {
    if (this._red !== r || this._green !== g || this._blue !== b) {
      r = Math.round(r || 0).clamp(0, 255);
      g = Math.round(g || 0).clamp(0, 255);
      b = Math.round(b || 0).clamp(0, 255);
      this._red = r;
      this._green = g;
      this._blue = b;
      this._colorText = Utils.rgbToCssColor(r, g, b);

      const graphics = this._graphics;
      graphics.clear();
      const intColor = (r << 16) | (g << 8) | b;
      graphics.beginFill(intColor, 1);
      // whole screen with zoom. BWAHAHAHAHA
      graphics.drawRect(
        -Graphics.width * 5,
        -Graphics.height * 5,
        Graphics.width * 10,
        Graphics.height * 10
      );
    }
  }
}
