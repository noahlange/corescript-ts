import Bitmap from './Bitmap';
import Graphics from './Graphics';
import Utils from './Utils';

/**
 * The basic object that is rendered to the game screen.
 *
 * @class Sprite
 * @constructor
 * @param {Bitmap} bitmap The image for the sprite
 */

export default class Sprite extends PIXI.Sprite {
  public static voidFilter = new PIXI.filters.AlphaFilter();

  // Number of the created objects.
  /// bungcip: currently public; used in TilingSprite
  public static _counter = 0;

  public spriteId: number;
  public opaque: boolean = false;

  protected _bitmap: Bitmap | null = null;
  protected _frame: PIXI.Rectangle = new PIXI.Rectangle();
  protected _realFrame: PIXI.Rectangle = new PIXI.Rectangle();
  protected _blendColor: number[] = [0, 0, 0, 0];
  protected _colorTone: number[] = [0, 0, 0, 0];
  protected _canvas: null | HTMLCanvasElement = null;
  protected _context: null | CanvasRenderingContext2D = null;
  protected _tintTexture: null | PIXI.BaseTexture = null;
  protected _renderWebGL_PIXI = super._renderWebGL;

  /**
   * use heavy renderer that will reduce border artifacts and apply advanced blendModes
   */
  protected _isPicture: boolean = false;
  protected _refreshFrame: boolean;

  constructor(bitmap?: Bitmap) {
    super(new PIXI.Texture(new PIXI.BaseTexture()));

    this.spriteId = Sprite._counter++;
    this.bitmap = bitmap;
  }

  /**
   * The image for the sprite.
   *
   * @property bitmap
   * @type Bitmap
   */
  get bitmap(): Bitmap {
    return this._bitmap;
  }
  set bitmap(value: Bitmap) {
    if (this._bitmap !== value) {
      this._bitmap = value;

      if (value) {
        this._refreshFrame = true;
        value.addLoadListener(this._onBitmapLoad.bind(this));
      } else {
        this._refreshFrame = false;
        this.texture.frame = PIXI.Rectangle.EMPTY;
      }
    }
  }

  /**
   * The width of the sprite without the scale.
   *
   * @property width
   * @type Number
   */
  get width(): number {
    return this._frame.width;
  }
  set width(value: number) {
    this._frame.width = value;
    this._refresh();
  }

  /**
   * The height of the sprite without the scale.
   *
   * @property height
   * @type Number
   */
  get height(): number {
    return this._frame.height;
  }
  set height(value: number) {
    this._frame.height = value;
    this._refresh();
  }

  /**
   * The opacity of the sprite (0 to 255).
   *
   * @property opacity
   * @type Number
   */
  get opacity(): number {
    return this.alpha * 255;
  }
  set opacity(value: number) {
    this.alpha = value.clamp(0, 255) / 255;
  }

  /**
   * Updates the sprite for each frame.
   *
   * @method update
   */
  public update() {
    this.children.forEach(child => {
      if ((child as any).update) {
        (child as any).update();
      }
    });
  }

  /**
   * Sets the x and y at once.
   */
  public move(
    /** The x coordinate of the sprite */
    x: number,
    /** The y coordinate of the sprite */
    y: number
  ) {
    this.x = x;
    this.y = y;
  }

  /**
   * Sets the rectagle of the bitmap that the sprite displays.
   */
  public setFrame(
    /** The x coordinate of the frame */
    x: number,
    /** The y coordinate of the frame */
    y: number,
    /** The width of the frame */
    width: number,
    /** The height of the frame */
    height: number
  ) {
    this._refreshFrame = false;
    const frame = this._frame;
    if (
      x !== frame.x ||
      y !== frame.y ||
      width !== frame.width ||
      height !== frame.height
    ) {
      frame.x = x;
      frame.y = y;
      frame.width = width;
      frame.height = height;
      this._refresh();
    }
  }

  /**
   * Gets the blend color for the sprite.
   */
  public getBlendColor(): number[] {
    return this._blendColor.clone();
  }

  /**
   * Sets the blend color for the sprite.
   */
  public setBlendColor(
    /** The color tone [r, g, b, gray] */
    color: number[]
  ): void {
    if (!(color instanceof Array)) {
      throw new Error('Argument must be an array');
    }
    if (!this._blendColor.equals(color)) {
      this._blendColor = color.clone();
      this._refresh();
    }
  }

  /**
   * Gets the color tone for the sprite.
   */
  public getColorTone(): number[] {
    return this._colorTone.clone();
  }

  /**
   * Sets the color tone for the sprite.
   */
  public setColorTone(
    /** The color tone [r, g, b, gray] */
    tone: number[]
  ) {
    if (!(tone instanceof Array)) {
      throw new Error('Argument must be an array');
    }
    if (!this._colorTone.equals(tone)) {
      this._colorTone = tone.clone();
      this._refresh();
    }
  }

  /**
   * checks if we need to speed up custom blendmodes
   */
  /// bungcip: public; used in TilingSprite
  public _speedUpCustomBlendModes(renderer: any) {
    const picture = renderer.plugins.picture;
    const blend = this.blendMode;
    if (renderer.renderingToScreen && renderer._activeRenderTarget.root) {
      if (picture.drawModes[blend]) {
        const stage = renderer._lastObjectRendered;
        const f = stage._filters;
        if (!f || !f[0]) {
          setTimeout(() => {
            if (!f || !f[0]) {
              stage.filters = [Sprite.voidFilter];
              stage.filterArea = new PIXI.Rectangle(
                0,
                0,
                Graphics.width,
                Graphics.height
              );
            }
          }, 0);
        }
      }
    }
  }

  protected _onBitmapLoad(bitmapLoaded: Bitmap) {
    if (bitmapLoaded === this._bitmap) {
      if (this._refreshFrame && this._bitmap) {
        this._refreshFrame = false;
        this._frame.width = this._bitmap.width;
        this._frame.height = this._bitmap.height;
      }
    }
    this._refresh();
  }

  protected _refresh() {
    const frameX = Math.floor(this._frame.x);
    const frameY = Math.floor(this._frame.y);
    const frameW = Math.floor(this._frame.width);
    const frameH = Math.floor(this._frame.height);
    const bitmapW = this._bitmap ? this._bitmap.width : 0;
    const bitmapH = this._bitmap ? this._bitmap.height : 0;
    const realX = frameX.clamp(0, bitmapW);
    const realY = frameY.clamp(0, bitmapH);
    const realW = (frameW - realX + frameX).clamp(0, bitmapW - realX);
    const realH = (frameH - realY + frameY).clamp(0, bitmapH - realY);

    this._realFrame.x = realX;
    this._realFrame.y = realY;
    this._realFrame.width = realW;
    this._realFrame.height = realH;
    this.pivot.x = frameX - realX;
    this.pivot.y = frameY - realY;

    if (realW > 0 && realH > 0) {
      if (this._needsTint()) {
        this._createTinter(realW, realH);
        this._executeTint(realX, realY, realW, realH);
        this._tintTexture.update();
        this.texture.baseTexture = this._tintTexture;
        this.texture.frame = new PIXI.Rectangle(0, 0, realW, realH);
      } else {
        if (this._bitmap) {
          this.texture.baseTexture = this._bitmap.baseTexture;
        }
        this.texture.frame = this._realFrame;
      }
    } else if (this._bitmap) {
      this.texture.frame = PIXI.Rectangle.EMPTY;
    } else {
      this.texture.baseTexture.width = Math.max(
        this.texture.baseTexture.width,
        this._frame.x + this._frame.width
      );
      this.texture.baseTexture.height = Math.max(
        this.texture.baseTexture.height,
        this._frame.y + this._frame.height
      );
      this.texture.frame = this._frame;
    }
    /// bungcip: changed to compile
    (this.texture as any)._updateID++;
  }

  /**
   * @method _isInBitmapRect
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w
   * @param {Number} h
   * @return {Boolean}
   * @private
   */
  protected _isInBitmapRect(x: number, y: number, w: number, h: number) {
    return (
      this._bitmap &&
      x + w > 0 &&
      y + h > 0 &&
      x < this._bitmap.width &&
      y < this._bitmap.height
    );
  }

  /**
   * @method _needsTint
   * @return {Boolean}
   * @private
   */
  protected _needsTint() {
    const tone = this._colorTone;
    return tone[0] || tone[1] || tone[2] || tone[3] || this._blendColor[3] > 0;
  }

  /**
   * @method _createTinter
   * @param {Number} w
   * @param {Number} h
   * @private
   */
  protected _createTinter(w: number, h: number) {
    if (!this._canvas) {
      this._canvas = document.createElement('canvas');
      this._context = this._canvas.getContext('2d');
    }

    this._canvas.width = w;
    this._canvas.height = h;

    if (!this._tintTexture) {
      this._tintTexture = new PIXI.BaseTexture(this._canvas);
    }

    this._tintTexture.width = w;
    this._tintTexture.height = h;
    this._tintTexture.scaleMode = this._bitmap.baseTexture.scaleMode;
  }

  /**
   * @method _executeTint
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w
   * @param {Number} h
   * @private
   */
  protected _executeTint(x: number, y: number, w: number, h: number) {
    const context = this._context;
    const tone = this._colorTone;
    const color = this._blendColor;

    context.globalCompositeOperation = 'copy';
    context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);

    if (Graphics.canUseSaturationBlend()) {
      const gray = Math.max(0, tone[3]);
      context.globalCompositeOperation = 'saturation';
      context.fillStyle = 'rgba(255,255,255,' + gray / 255 + ')';
      context.fillRect(0, 0, w, h);
    }

    const r1 = Math.max(0, tone[0]);
    const g1 = Math.max(0, tone[1]);
    const b1 = Math.max(0, tone[2]);
    context.globalCompositeOperation = 'lighter';
    context.fillStyle = Utils.rgbToCssColor(r1, g1, b1);
    context.fillRect(0, 0, w, h);

    if (Graphics.canUseDifferenceBlend()) {
      context.globalCompositeOperation = 'difference';
      context.fillStyle = 'white';
      context.fillRect(0, 0, w, h);

      const r2 = Math.max(0, -tone[0]);
      const g2 = Math.max(0, -tone[1]);
      const b2 = Math.max(0, -tone[2]);
      context.globalCompositeOperation = 'lighter';
      context.fillStyle = Utils.rgbToCssColor(r2, g2, b2);
      context.fillRect(0, 0, w, h);

      context.globalCompositeOperation = 'difference';
      context.fillStyle = 'white';
      context.fillRect(0, 0, w, h);
    }

    const r3 = Math.max(0, color[0]);
    const g3 = Math.max(0, color[1]);
    const b3 = Math.max(0, color[2]);
    const a3 = Math.max(0, color[3]);
    context.globalCompositeOperation = 'source-atop';
    context.fillStyle = Utils.rgbToCssColor(r3, g3, b3);
    context.globalAlpha = a3 / 255;
    context.fillRect(0, 0, w, h);

    context.globalCompositeOperation = 'destination-in';
    context.globalAlpha = 1;
    context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);
  }

  /**
   * @method _renderWebGL
   * @param {Object} renderer
   * @private
   */
  protected _renderWebGL(renderer: PIXI.WebGLRenderer) {
    if (this.bitmap) {
      this.bitmap.touch();
    }
    if (this.bitmap && !this.bitmap.isReady()) {
      return;
    }
    if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
      if (this._bitmap) {
        this._bitmap.checkDirty();
      }

      // copy of pixi-v4 internal code
      this.calculateVertices();

      if (this._isPicture) {
        // use heavy renderer, which reduces artifacts and applies corrent blendMode,
        // but does not use multitexture optimization
        this._speedUpCustomBlendModes(renderer);
        renderer.setObjectRenderer((renderer.plugins as any).picture);
        (renderer.plugins as any).picture.render(this);
      } else {
        // use pixi super-speed renderer
        renderer.setObjectRenderer((renderer.plugins as any).sprite);
        (renderer.plugins as any).sprite.render(this);
      }
    }
  }
}
