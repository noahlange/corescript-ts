//-----------------------------------------------------------------------------
/**
 * The basic object that is rendered to the game screen.
 *
 * @class Sprite
 * @constructor
 * @param {Bitmap} bitmap The image for the sprite
 */
class Sprite extends PIXI.Sprite {
    protected _bitmap: Bitmap | null;
    protected _frame: Rectangle;
    protected _realFrame: Rectangle;
    protected _blendColor: number[];
    protected _colorTone: number[];
    protected _canvas: null | HTMLCanvasElement;
    protected _context: null | CanvasRenderingContext2D;
    protected _tintTexture: null | PIXI.BaseTexture;
    /**
     * use heavy renderer that will reduce border artifacts and apply advanced blendModes
     * @type {boolean}
     * @private
     */
    protected _isPicture: boolean;

    protected _refreshFrame: boolean;

    public spriteId: number;
    public opaque: boolean;

    static voidFilter = new PIXI.filters.VoidFilter();
    constructor(bitmap?: Bitmap) {
        super(new PIXI.Texture(new PIXI.BaseTexture()))

        this._bitmap = null;
        this._frame = new Rectangle();
        this._realFrame = new Rectangle();
        this._blendColor = [0, 0, 0, 0];
        this._colorTone = [0, 0, 0, 0];
        this._canvas = null;
        this._context = null;
        this._tintTexture = null;

        this._isPicture = false;

        this.spriteId = Sprite._counter++;
        this.opaque = false;

        this.bitmap = bitmap;
    };

    // Number of the created objects.
    /// bungcip: pakai public karena dipakai di TilingSprite
    public static _counter = 0;

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
                this.texture.frame = Rectangle.emptyRectangle;
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
    update() {
        this.children.forEach(function (child) {
            if ((child as any)['update']) {
                (child as any)['update']();
            }
        });
    };

    /**
     * Sets the x and y at once.
     *
     * @method move
     * @param {Number} x The x coordinate of the sprite
     * @param {Number} y The y coordinate of the sprite
     */
    move(x: number, y: number) {
        this.x = x;
        this.y = y;
    };

    /**
     * Sets the rectagle of the bitmap that the sprite displays.
     *
     * @method setFrame
     * @param {Number} x The x coordinate of the frame
     * @param {Number} y The y coordinate of the frame
     * @param {Number} width The width of the frame
     * @param {Number} height The height of the frame
     */
    setFrame(x:number, y:number, width:number, height:number) {
        this._refreshFrame = false;
        var frame = this._frame;
        if (x !== frame.x || y !== frame.y ||
            width !== frame.width || height !== frame.height) {
            frame.x = x;
            frame.y = y;
            frame.width = width;
            frame.height = height;
            this._refresh();
        }
    };

    /**
     * Gets the blend color for the sprite.
     *
     * @method getBlendColor
     * @return {Array} The blend color [r, g, b, a]
     */
    getBlendColor(): number[] {
        return this._blendColor.clone();
    };

    /**
     * Sets the blend color for the sprite.
     *
     * @method setBlendColor
     * @param {Array} color The blend color [r, g, b, a]
     */
    setBlendColor(color: number[]) {
        if (!(color instanceof Array)) {
            throw new Error('Argument must be an array');
        }
        if (!this._blendColor.equals(color)) {
            this._blendColor = color.clone();
            this._refresh();
        }
    };

    /**
     * Gets the color tone for the sprite.
     *
     * @method getColorTone
     * @return {Array} The color tone [r, g, b, gray]
     */
    getColorTone() {
        return this._colorTone.clone();
    };

    /**
     * Sets the color tone for the sprite.
     *
     * @method setColorTone
     * @param {Array} tone The color tone [r, g, b, gray]
     */
    setColorTone(tone: number[]) {
        if (!(tone instanceof Array)) {
            throw new Error('Argument must be an array');
        }
        if (!this._colorTone.equals(tone)) {
            this._colorTone = tone.clone();
            this._refresh();
        }
    };

    /**
     * @method _onBitmapLoad
     * @private
     */
    protected _onBitmapLoad(bitmapLoaded: Bitmap) {
        if (bitmapLoaded === this._bitmap) {
            if (this._refreshFrame && this._bitmap) {
                this._refreshFrame = false;
                this._frame.width = this._bitmap.width;
                this._frame.height = this._bitmap.height;
            }
        }

        this._refresh();
    };

    /**
     * @method _refresh
     * @private
     */
    protected _refresh() {
        var frameX = Math.floor(this._frame.x);
        var frameY = Math.floor(this._frame.y);
        var frameW = Math.floor(this._frame.width);
        var frameH = Math.floor(this._frame.height);
        var bitmapW = this._bitmap ? this._bitmap.width : 0;
        var bitmapH = this._bitmap ? this._bitmap.height : 0;
        var realX = frameX.clamp(0, bitmapW);
        var realY = frameY.clamp(0, bitmapH);
        var realW = (frameW - realX + frameX).clamp(0, bitmapW - realX);
        var realH = (frameH - realY + frameY).clamp(0, bitmapH - realY);

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
                this.texture.frame = new Rectangle(0, 0, realW, realH);
            } else {
                if (this._bitmap) {
                    this.texture.baseTexture = this._bitmap.baseTexture;
                }
                this.texture.frame = this._realFrame;
            }
        } else if (this._bitmap) {
            this.texture.frame = Rectangle.emptyRectangle;
        } else {
            this.texture.baseTexture.width = Math.max(this.texture.baseTexture.width, this._frame.x + this._frame.width);
            this.texture.baseTexture.height = Math.max(this.texture.baseTexture.height, this._frame.y + this._frame.height);
            this.texture.frame = this._frame;
        }
        /// bungcip: changed to compile
        (this.texture as any)._updateID++;
    };

    /**
     * @method _isInBitmapRect
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @return {Boolean}
     * @private
     */
    protected _isInBitmapRect(x:number, y:number, w:number, h:number) {
        return (this._bitmap && x + w > 0 && y + h > 0 &&
            x < this._bitmap.width && y < this._bitmap.height);
    };

    /**
     * @method _needsTint
     * @return {Boolean}
     * @private
     */
    protected _needsTint() {
        var tone = this._colorTone;
        return tone[0] || tone[1] || tone[2] || tone[3] || this._blendColor[3] > 0;
    };

    /**
     * @method _createTinter
     * @param {Number} w
     * @param {Number} h
     * @private
     */
    protected _createTinter(w:number, h:number) {
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
    };

    /**
     * @method _executeTint
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @private
     */
    protected _executeTint(x:number, y:number, w:number, h:number) {
        var context = this._context;
        var tone = this._colorTone;
        var color = this._blendColor;

        context.globalCompositeOperation = 'copy';
        context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);

        if (Graphics.canUseSaturationBlend()) {
            var gray = Math.max(0, tone[3]);
            context.globalCompositeOperation = 'saturation';
            context.fillStyle = 'rgba(255,255,255,' + gray / 255 + ')';
            context.fillRect(0, 0, w, h);
        }

        var r1 = Math.max(0, tone[0]);
        var g1 = Math.max(0, tone[1]);
        var b1 = Math.max(0, tone[2]);
        context.globalCompositeOperation = 'lighter';
        context.fillStyle = Utils.rgbToCssColor(r1, g1, b1);
        context.fillRect(0, 0, w, h);

        if (Graphics.canUseDifferenceBlend()) {
            context.globalCompositeOperation = 'difference';
            context.fillStyle = 'white';
            context.fillRect(0, 0, w, h);

            var r2 = Math.max(0, -tone[0]);
            var g2 = Math.max(0, -tone[1]);
            var b2 = Math.max(0, -tone[2]);
            context.globalCompositeOperation = 'lighter';
            context.fillStyle = Utils.rgbToCssColor(r2, g2, b2);
            context.fillRect(0, 0, w, h);

            context.globalCompositeOperation = 'difference';
            context.fillStyle = 'white';
            context.fillRect(0, 0, w, h);
        }

        var r3 = Math.max(0, color[0]);
        var g3 = Math.max(0, color[1]);
        var b3 = Math.max(0, color[2]);
        var a3 = Math.max(0, color[3]);
        context.globalCompositeOperation = 'source-atop';
        context.fillStyle = Utils.rgbToCssColor(r3, g3, b3);
        context.globalAlpha = a3 / 255;
        context.fillRect(0, 0, w, h);

        context.globalCompositeOperation = 'destination-in';
        context.globalAlpha = 1;
        context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);
    };

    protected _renderCanvas_PIXI = super._renderCanvas;
    protected _renderWebGL_PIXI = super._renderWebGL;

    /**
     * @method _renderCanvas
     * @param {Object} renderer
     * @private
     */
    protected _renderCanvas(renderer: PIXI.CanvasRenderer) {
        if (this.bitmap) {
            this.bitmap.touch();
        }
        if (this.bitmap && !this.bitmap.isReady()) {
            return;
        }

        if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
            this._renderCanvas_PIXI(renderer);
        }
    };

    /**
     * checks if we need to speed up custom blendmodes
     * @param renderer
     * @private
     */
    /// bungcip: jadi public karena dipakai di TilingSprite
    public _speedUpCustomBlendModes(renderer: any) {
        var picture = renderer.plugins.picture;
        var blend = this.blendMode;
        if (renderer.renderingToScreen && renderer._activeRenderTarget.root) {
            if (picture.drawModes[blend]) {
                var stage = renderer._lastObjectRendered;
                var f = stage._filters;
                if (!f || !f[0]) {
                    setTimeout(function () {
                        var f = stage._filters;
                        if (!f || !f[0]) {
                            stage.filters = [Sprite.voidFilter];
                            stage.filterArea = new PIXI.Rectangle(0, 0, Graphics.width, Graphics.height);
                        }
                    }, 0);
                }
            }
        }
    };

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

            //copy of pixi-v4 internal code
            this.calculateVertices();

            if (this._isPicture) {
                // use heavy renderer, which reduces artifacts and applies corrent blendMode,
                // but does not use multitexture optimization
                this._speedUpCustomBlendModes(renderer);
                renderer.setObjectRenderer((renderer.plugins as any)['picture']);
                (renderer.plugins as any)['picture'].render(this);
            } else {
                // use pixi super-speed renderer
                renderer.setObjectRenderer((renderer.plugins as any)['sprite']);
                (renderer.plugins as any)['sprite'].render(this);
            }
        }
    };

}





// The important members from Pixi.js

/**
 * The visibility of the sprite.
 *
 * @property visible
 * @type Boolean
 */

/**
 * The x coordinate of the sprite.
 *
 * @property x
 * @type Number
 */

/**
 * The y coordinate of the sprite.
 *
 * @property y
 * @type Number
 */

/**
 * The origin point of the sprite. (0,0) to (1,1).
 *
 * @property anchor
 * @type Point
 */

/**
 * The scale factor of the sprite.
 *
 * @property scale
 * @type Point
 */

/**
 * The rotation of the sprite in radians.
 *
 * @property rotation
 * @type Number
 */

/**
 * The blend mode to be applied to the sprite.
 *
 * @property blendMode
 * @type Number
 */

/**
 * Sets the filters for the sprite.
 *
 * @property filters
 * @type Array
 */

/**
 * [read-only] The array of children of the sprite.
 *
 * @property children
 * @type Array
 */

/**
 * [read-only] The object that contains the sprite.
 *
 * @property parent
 * @type Object
 */

/**
 * Adds a child to the container.
 *
 * @method addChild
 * @param {Object} child The child to add
 * @return {Object} The child that was added
 */

/**
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {Object} child The child to add
 * @param {Number} index The index to place the child in
 * @return {Object} The child that was added
 */

/**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {Object} child The child to remove
 * @return {Object} The child that was removed
 */

/**
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {Number} index The index to get the child from
 * @return {Object} The child that was removed
 */
