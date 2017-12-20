// import * as PIXI from 'pixi.js';
import CacheEntry from './CacheEntry';
import Graphics from './Graphics';
import ResourceHandler from './ResourceHandler';
import Stage from './Stage';

export enum LoadingState {
  /* empty */
  NONE,
  /* url requested, but pending to load until startRequest called */
  PENDING,
  /* url request completed and purged.*/
  PURGED,
  /* requesting supplied URI now.*/
  REQUESTING,
  /* request completed */
  COMPLETED,
  /* loaded into memory */
  LOADED,
  /* error occured */
  ERROR
}

/**
 * The basic object that represents an image.
 */
export default class Bitmap {
  /**
   * Loads a image file from a URL and returns a new Bitmap.
   */
  public static load(url: string): Bitmap {
    const bitmap = new Bitmap(undefined, undefined, true);
    bitmap._decodeAfterRequest = true;
    bitmap._requestImage(url);
    return bitmap;
  }

  public static request(url: string): Bitmap {
    const bitmap = new Bitmap(undefined, undefined, true);
    bitmap._url = url;
    bitmap._loadingState = LoadingState.PENDING;
    return bitmap;
  }

  /**
   * Takes a snapshot of the game screen and returns a new bitmap object.
   */
  public static snap(stage: Stage) {
    const width = Graphics.width;
    const height = Graphics.height;
    const bitmap = new Bitmap(width, height);
    const context = bitmap._context;
    const renderTexture = PIXI.RenderTexture.create(width, height);
    if (stage) {
      Graphics._renderer.render(stage, renderTexture);
      stage.worldTransform.identity();
      // let canvas = null;
      const canvas = Graphics._renderer.extract.canvas(renderTexture);
      context.drawImage(canvas, 0, 0);
    }
    // bungcip: pixi 4.5 uses a boolean
    renderTexture.destroy(true);
    bitmap._setDirty();
    return bitmap;
  }

  // for iOS. img consumes memory. so reuse it.
  protected static _reuseImages: HTMLImageElement[] = [];

  get canvas() {
    // We don't want to waste memory, so creating canvas is deferred.
    if (!this._canvas) {
      this._createCanvas();
    }
    return this._canvas;
  }

  get context() {
    if (!this._context) {
      this._createCanvas();
    }
    return this._context;
  }

  get baseTexture() {
    if (!this._baseTexture) {
      this._createBaseTexture(this._image || this._canvas);
    }
    return this._baseTexture;
  }

  /**
   * The url of the image file.
   */
  get url() {
    return this._url;
  }
  /**
   * The width of the bitmap.
   *
   * @property width
   * @type Number
   */
  get width() {
    if (this.isReady()) {
      return this._image ? this._image.width : this._canvas.width;
    }
    return 0;
  }
  /**
   * The height of the bitmap (read-only).
   */
  get height(): number {
    if (this.isReady()) {
      return this._image ? this._image.height : this._canvas.height;
    }
    return 0;
  }
  /**
   * [read-only] The rectangle of the bitmap.
   */
  get rect(): PIXI.Rectangle {
    return new PIXI.Rectangle(0, 0, this.width, this.height);
  }
  /**
   * Whether the smooth scaling is applied.
   */
  get smooth(): boolean {
    return this._smooth;
  }

  set smooth(value: boolean) {
    if (this._smooth !== value) {
      this._smooth = value;
      if (this._baseTexture) {
        this._baseTexture.scaleMode = this._smooth
          ? PIXI.SCALE_MODES.LINEAR
          : PIXI.SCALE_MODES.NEAREST;
      }
    }
  }

  get paintOpacity() {
    return this._paintOpacity;
  }

  set paintOpacity(value: number) {
    if (this._paintOpacity !== value) {
      this._paintOpacity = value;
      this._context.globalAlpha = this._paintOpacity / 255;
    }
  }

  /**
   * Cache entry, for images. In all cases _url is the same as cacheEntry.key.
   */
  public cacheEntry: CacheEntry | null;

  /**
   * The face name of the font.
   */
  public fontFace: string;

  /**
   * The size of the font in pixels.
   */
  public fontSize: number;

  /**
   * Whether the font is italic.
   */
  public fontItalic: boolean;

  /**
   * The color of the text in CSS format.
   */
  public textColor: string;
  public outlineColor: string;
  public outlineWidth: number;

  protected _image: HTMLImageElement | null;
  protected _errorListener: () => void;
  protected _loadListener: () => void;
  protected _loader: () => void;
  protected _url: string;
  protected _loadingState: LoadingState;
  protected _decodeAfterRequest: boolean;
  protected _loadListeners: Array<(bitmap: Bitmap) => void>;
  protected _dirty: boolean;

  private _baseTexture: PIXI.BaseTexture;
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;
  private _smooth: boolean;

  /**
   * The opacity of the drawing object in the range (0, 255).
   */
  private _paintOpacity: number;

  public constructor(width?: number, height?: number, defer = false) {
    if (!defer) {
      this._createCanvas(width, height);
    }
    this._image = null;
    this._url = '';
    this._paintOpacity = 255;
    this._smooth = false;
    this._loadListeners = [];
    this._loadingState = LoadingState.NONE;
    this._decodeAfterRequest = false;
    this.cacheEntry = null;
    this.fontFace = 'GameFont';
    this.fontSize = 28;
    this.fontItalic = false;
    this.textColor = '#ffffff';
    // The color of the outline of the text in CSS format.
    this.outlineColor = 'rgba(0, 0, 0, 0.5)';
    // The width of the outline of the text.
    this.outlineWidth = 4;
  }

  /**
   * Checks whether the bitmap is ready to render.
   */
  public isReady(): boolean {
    return (
      this._loadingState === LoadingState.LOADED ||
      this._loadingState === LoadingState.NONE
    );
  }

  /**
   * Checks whether a loading error has occurred.
   */
  public isError(): boolean {
    return this._loadingState === LoadingState.ERROR;
  }

  /**
   * touch the resource
   */
  public touch(): void {
    if (this.cacheEntry) {
      this.cacheEntry.touch();
    }
  }

  /**
   * Resizes bitmap.
   */
  public resize(width: number = 0, height: number = 0): void {
    width = Math.max(width || 0, 1);
    height = Math.max(height || 0, 1);
    this._canvas.width = width;
    this._canvas.height = height;
    this._baseTexture.width = width;
    this._baseTexture.height = height;
  }

  /**
   * Performs a block transfer.
   */
  public blt(
    /** The bitmap to draw.  */
    source: Bitmap,
    /** The x coordinate in the source. */
    sx: number,
    /** The y coordinate in the source. */
    sy: number,
    /** The width of the source image. */
    sw: number,
    /** The height of the source image. */
    sh: number,
    /** The x coordinate in the destination.  */
    dx: number,
    /** The y coordinate in the destination. */
    dy: number,
    /** The width to draw the image in the destination. */
    dw: number = sw,
    /** The height to draw the image in the destination. */
    dh: number = sh
  ) {
    if (
      sx >= 0 &&
      sy >= 0 &&
      sw > 0 &&
      sh > 0 &&
      dw > 0 &&
      dh > 0 &&
      sx + sw <= source.width &&
      sy + sh <= source.height
    ) {
      this._context.globalCompositeOperation = 'source-over';
      this._context.drawImage(source.canvas, sx, sy, sw, sh, dx, dy, dw, dh);
      this._setDirty();
    }
  }

  public bltImage(
    /** The bitmap to draw.  */
    source: Bitmap,
    /** The x coordinate in the source. */
    sx: number,
    /** The y coordinate in the source. */
    sy: number,
    /** The width of the source image. */
    sw: number,
    /** The height of the source image. */
    sh: number,
    /** The x coordinate in the destination.  */
    dx: number,
    /** The y coordinate in the destination. */
    dy: number,
    /** The width to draw the image in the destination. */
    dw: number = sw,
    /** The height to draw the image in the destination. */
    dh: number = sh
  ) {
    if (
      sx >= 0 &&
      sy >= 0 &&
      sw > 0 &&
      sh > 0 &&
      dw > 0 &&
      dh > 0 &&
      sx + sw <= source.width &&
      sy + sh <= source.height
    ) {
      this._context.globalCompositeOperation = 'source-over';
      this._context.drawImage(source._image, sx, sy, sw, sh, dx, dy, dw, dh);
      this._setDirty();
    }
  }
  /**
   * Returns pixel color in hex at the specified point.
   */
  public getPixel(
    /** The x coordinate of the pixel in the bitmap. */
    x: number,
    /** The y coordinate of the pixel in the bitmap. */ y: number
  ): string {
    const data = this._context.getImageData(x, y, 1, 1).data;
    let result = '#';
    for (let i = 0; i < 3; i++) {
      result += data[i].toString(16).padZero(2);
    }
    return result;
  }

  /**
   * Returns alpha pixel value at the specified point.
   */
  public getAlphaPixel(
    /** The x coordinate of the pixel in the bitmap. */
    x: number,
    /** The y coordinate of the pixel in the bitmap. */
    y: number
  ) {
    const { data } = this._context.getImageData(x, y, 1, 1);
    return data[3];
  }

  /**
   * Clears the specified rectangle.
   */
  public clearRect(
    /** The x coordinate for the upper-left corner */
    x: number,
    /** The y coordinate for the upper-left corner  */
    y: number,
    /** The width of the rectangle to clear */
    width: number,
    /** The height of the rectangle to clear */
    height: number
  ) {
    this._context.clearRect(x, y, width, height);
    this._setDirty();
  }

  /**
   * Clears the entire bitmap.
   */
  public clear(): void {
    this.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Fills the specified rectangle.
   */
  public fillRect(
    /** The x coordinate for the upper-left corner */
    x: number,
    /** The y coordinate for the upper-left corner */
    y: number,
    /** The width of the rectangle to fill */
    width: number,
    /** The height of the rectangle to fill */
    height: number,
    /** Color of the rectangle (CSS format). */
    color: string
  ): void {
    const context = this._context;
    context.save();
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
    context.restore();
    this._setDirty();
  }

  public decode(): void {
    switch (this._loadingState) {
      case LoadingState.COMPLETED:
        this._loadingState = LoadingState.LOADED;
        if (!this._canvas) {
          this._createBaseTexture(this._image);
        }
        this._setDirty();
        this._callLoadListeners();
        break;
      case LoadingState.REQUESTING:
        this._decodeAfterRequest = true;
        if (!this._loader) {
          this._loader = ResourceHandler.createLoader(
            this._url,
            this._requestImage.bind(this, this._url),
            this._onError.bind(this)
          );
          this._image.removeEventListener('error', this._errorListener);
          this._image.addEventListener(
            'error',
            (this._errorListener = this._loader)
          );
        }
        break;
      case LoadingState.PENDING:
      case LoadingState.PURGED:
      case LoadingState.ERROR:
        this._decodeAfterRequest = true;
        this._requestImage(this._url);
        break;
    }
  }

  /**
   * Updates texture if bitmap was dirty.
   */
  public checkDirty(): void {
    if (this._dirty) {
      this._baseTexture.update();
      this._dirty = false;
    }
  }

  public isRequestOnly(): boolean {
    return !(this._decodeAfterRequest || this.isReady());
  }

  public isRequestReady(): boolean {
    return (
      this._loadingState !== LoadingState.PENDING &&
      this._loadingState !== LoadingState.REQUESTING
    );
  }

  public startRequest(): void {
    if (this._loadingState === LoadingState.PENDING) {
      this._decodeAfterRequest = false;
      this._requestImage(this._url);
    }
  }

  public fillAll(
    /** The color of the rectangle in CSS format */
    color: string
  ): void {
    this.fillRect(0, 0, this.width, this.height, color);
  }

  /*
   * Draws the rectangle with a gradient.
   */
  public gradientFillRect(
    /** The x coordinate for the upper-left corner */
    x: number,
    /** The y coordinate for the upper-left corner */
    y: number,
    /** The width of the rectangle to fill */
    width: number,
    /** The height of the rectangle to fill */
    height: number,
    /** The gradient starting color */
    color1: string,
    /** The gradient ending color */
    color2: string,
    /** Whether or not the gradient should be draw vertically */
    vertical: boolean = false
  ) {
    const context = this._context;
    const grad = vertical
      ? context.createLinearGradient(x, y, x, y + height)
      : context.createLinearGradient(x, y, x + width, y);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    context.save();
    context.fillStyle = grad;
    context.fillRect(x, y, width, height);
    context.restore();
    this._setDirty();
  }

  /**
   * Draw a bitmap in the shape of a circle
   *
   * @method drawCircle
   * @param {Number} x The x coordinate based on the circle center
   * @param {Number} y The y coordinate based on the circle center
   * @param {Number} radius The radius of the circle
   * @param {String} color The color of the circle in CSS format
   */
  public drawCircle(x: number, y: number, radius: number, color: string) {
    const context = this._context;
    context.save();
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fill();
    context.restore();
    this._setDirty();
  }

  /**
   * Draws the outline text to the bitmap.
   */
  public drawText(
    /** The text that will be drawn */
    text: string,
    /** The x coordinate for the left of the text */
    x: number,
    /** The y coordinate for the top of the text */
    y: number,
    /** The maximum allowed width of the text */
    maxWidth: number,
    /** The height of the text line */
    lineHeight: number,
    /** The alignment of the text */
    align?: string
  ) {
    // Note: Firefox has a bug with textBaseline: Bug 737852
    //       So we use 'alphabetic' here.
    if (text !== undefined) {
      let tx = x;
      const ty = y + lineHeight - (lineHeight - this.fontSize * 0.7) / 2;
      const context = this._context;
      const alpha = context.globalAlpha;
      maxWidth = maxWidth || 0xffffffff;
      if (align === 'center') {
        tx += maxWidth / 2;
      }
      if (align === 'right') {
        tx += maxWidth;
      }
      context.save();
      context.font = this._makeFontNameText();
      context.textAlign = align;
      context.textBaseline = 'alphabetic';
      context.globalAlpha = 1;
      this._drawTextOutline(text, tx, ty, maxWidth);
      context.globalAlpha = alpha;
      this._drawTextBody(text, tx, ty, maxWidth);
      context.restore();
      this._setDirty();
    }
  }
  /**
   * Returns the width of the specified text in px.
   */
  public measureTextWidth(
    /** The text to be measured */
    text: string
  ): number {
    const context = this._context;
    context.save();
    context.font = this._makeFontNameText();
    const width = context.measureText(text).width;
    context.restore();
    return width;
  }

  /**
   * Changes the color tone of the entire bitmap.
   */
  public adjustTone(
    /** Red component (-255, 255) */
    r: number,
    /** Green component (-255, 255) */
    g: number,
    /** Blue component (-255, 255) */
    b: number
  ) {
    if ((r || g || b) && this.width > 0 && this.height > 0) {
      const context = this._context;
      const imageData = context.getImageData(0, 0, this.width, this.height);
      const pixels = imageData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        pixels[i + 0] += r;
        pixels[i + 1] += g;
        pixels[i + 2] += b;
      }
      context.putImageData(imageData, 0, 0);
      this._setDirty();
    }
  }

  /**
   * Rotates the hue of the entire bitmap.
   */
  public rotateHue(
    /** the hue offset in 360 degrees */
    offset: number
  ) {
    function rgbToHsl(r: number, g: number, b: number) {
      const cmin = Math.min(r, g, b);
      const cmax = Math.max(r, g, b);
      let h = 0;
      let s = 0;
      const l = (cmin + cmax) / 2;
      const delta = cmax - cmin;
      if (delta > 0) {
        if (r === cmax) {
          h = 60 * (((g - b) / delta + 6) % 6);
        } else if (g === cmax) {
          h = 60 * ((b - r) / delta + 2);
        } else {
          h = 60 * ((r - g) / delta + 4);
        }
        s = delta / (255 - Math.abs(2 * l - 255));
      }
      return [h, s, l];
    }

    function hslToRgb(h: number, s: number, l: number) {
      const c = (255 - Math.abs(2 * l - 255)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;
      const cm = c + m;
      const xm = x + m;
      if (h < 60) {
        return [cm, xm, m];
      } else if (h < 120) {
        return [xm, cm, m];
      } else if (h < 180) {
        return [m, cm, xm];
      } else if (h < 240) {
        return [m, xm, cm];
      } else if (h < 300) {
        return [xm, m, cm];
      } else {
        return [cm, m, xm];
      }
    }

    if (offset && this.width > 0 && this.height > 0) {
      offset = (offset % 360 + 360) % 360;
      const context = this._context;
      const imageData = context.getImageData(0, 0, this.width, this.height);
      const pixels = imageData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const hsl = rgbToHsl(pixels[i + 0], pixels[i + 1], pixels[i + 2]);
        const h = (hsl[0] + offset) % 360;
        const s = hsl[1];
        const l = hsl[2];
        const rgb = hslToRgb(h, s, l);
        pixels[i + 0] = rgb[0];
        pixels[i + 1] = rgb[1];
        pixels[i + 2] = rgb[2];
      }
      context.putImageData(imageData, 0, 0);
      this._setDirty();
    }
  }

  /**
   * Applies a blur effect to the bitmap.
   */
  public blur() {
    for (let i = 0; i < 2; i++) {
      const w = this.width;
      const h = this.height;
      const canvas = this._canvas;
      const context = this._context;
      const tempCanvas = document.createElement('canvas');
      const tempContext = tempCanvas.getContext('2d');
      tempCanvas.width = w + 2;
      tempCanvas.height = h + 2;
      tempContext.drawImage(canvas, 0, 0, w, h, 1, 1, w, h);
      tempContext.drawImage(canvas, 0, 0, w, 1, 1, 0, w, 1);
      tempContext.drawImage(canvas, 0, 0, 1, h, 0, 1, 1, h);
      tempContext.drawImage(canvas, 0, h - 1, w, 1, 1, h + 1, w, 1);
      tempContext.drawImage(canvas, w - 1, 0, 1, h, w + 1, 1, 1, h);
      context.save();
      context.fillStyle = 'black';
      context.fillRect(0, 0, w, h);
      context.globalCompositeOperation = 'lighter';
      context.globalAlpha = 1 / 9;
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          context.drawImage(tempCanvas, x, y, w, h, 0, 0, w, h);
        }
      }
      context.restore();
    }
    this._setDirty();
  }
  /**
   * Add a callback function that will be called when the bitmap is loaded.
   */
  public addLoadListener(callback: (bitmap: Bitmap) => void) {
    if (!this.isReady()) {
      this._loadListeners.push(callback);
    } else {
      callback(this);
    }
  }

  protected _onLoad() {
    this._image.removeEventListener('load', this._loadListener);
    this._image.removeEventListener('error', this._errorListener);
    this._renewCanvas();
    switch (this._loadingState) {
      case LoadingState.REQUESTING:
        this._loadingState = LoadingState.COMPLETED;
        if (this._decodeAfterRequest) {
          this.decode();
        } else {
          this._loadingState = LoadingState.PURGED;
          this._clearImgInstance();
        }
        break;
    }
  }

  protected _onError() {
    this._image.removeEventListener('load', this._loadListener);
    this._image.removeEventListener('error', this._errorListener);
    this._loadingState = LoadingState.ERROR;
  }

  private _callLoadListeners() {
    while (this._loadListeners.length > 0) {
      const listener = this._loadListeners.shift();
      listener(this);
    }
  }

  /**
   * Creates a canvas element, resizing and populating with `Bitmap._image` if
   * available.
   */
  private _createCanvas(width: number = 0, height: number = 0) {
    this._canvas = this._canvas || document.createElement('canvas');
    this._context = this._canvas.getContext('2d');
    this._canvas.width = Math.max(width, 1);
    this._canvas.height = Math.max(height, 1);
    if (this._image) {
      const w = Math.max(this._image.width || 0, 1);
      const h = Math.max(this._image.height || 0, 1);
      this._canvas.width = w;
      this._canvas.height = h;
      this._createBaseTexture(this._canvas);
      this._context.drawImage(this._image, 0, 0);
    }
    this._setDirty();
  }

  private _createBaseTexture(source: HTMLImageElement | HTMLCanvasElement) {
    this._baseTexture = new PIXI.BaseTexture(source);
    this._baseTexture.mipmap = false;
    this._baseTexture.width = source.width;
    this._baseTexture.height = source.height;
    this._baseTexture.scaleMode = this._smooth
      ? PIXI.SCALE_MODES.LINEAR
      : PIXI.SCALE_MODES.NEAREST;
  }

  private _clearImgInstance() {
    this._image.src = '';
    this._image.onload = null;
    this._image.onerror = null;
    this._errorListener = null;
    this._loadListener = null;
    Bitmap._reuseImages.push(this._image);
    this._image = null;
  }

  private _renewCanvas() {
    const newImage = this._image;
    if (
      newImage &&
      this._canvas &&
      (this._canvas.width < newImage.width ||
        this._canvas.height < newImage.height)
    ) {
      this._createCanvas();
    }
  }

  private _setDirty() {
    this._dirty = true;
  }

  private _requestImage(url: string) {
    this._image =
      Bitmap._reuseImages.length !== 0
        ? Bitmap._reuseImages.pop()
        : new Image();
    if (this._decodeAfterRequest && !this._loader) {
      this._loader = ResourceHandler.createLoader(
        url,
        this._requestImage.bind(this, url),
        this._onError.bind(this)
      );
    }
    this._image = new Image();
    this._url = url;
    this._loadingState = LoadingState.REQUESTING;
    this._image.src = url;
    this._image.addEventListener(
      'load',
      (this._loadListener = this._onLoad.bind(this))
    );
    this._image.addEventListener(
      'error',
      (this._errorListener = this._loader || this._onError.bind(this))
    );
  }

  /**
   * @method _makeFontNameText
   * @private
   */
  private _makeFontNameText() {
    return (
      (this.fontItalic ? 'Italic ' : '') + this.fontSize + 'px ' + this.fontFace
    );
  }

  private _drawTextOutline(
    text: string,
    tx: number,
    ty: number,
    maxWidth: number
  ) {
    const context = this._context;
    context.strokeStyle = this.outlineColor;
    context.lineWidth = this.outlineWidth;
    context.lineJoin = 'round';
    context.strokeText(text, tx, ty, maxWidth);
  }

  private _drawTextBody(
    text: string,
    tx: number,
    ty: number,
    maxWidth: number
  ) {
    const context = this._context;
    context.fillStyle = this.textColor;
    context.fillText(text, tx, ty, maxWidth);
  }
}
