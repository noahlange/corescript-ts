//-----------------------------------------------------------------------------
/**
 * The sprite object for a tiling image.
 *
 * @class TilingSprite
 * @constructor
 * @param {Bitmap} bitmap The image for the tiling sprite
 */
class TilingSprite extends PIXI.extras.PictureTilingSprite {
    protected _bitmap: Bitmap | null;
    protected _frame: Rectangle;

    public spriteId: number;

    /**
     * The origin point of the tiling sprite for scrolling.
     *
     * @property origin
     * @type Point
     */
    public origin: Point;

    public tilingTexture: any;

    constructor(bitmap?: Bitmap) {
        super(new PIXI.Texture(new PIXI.BaseTexture()));

        this._bitmap = null;
        this._width = 0;
        this._height = 0;
        this._frame = new Rectangle();
        this.spriteId = Sprite._counter++;

        this.origin = new Point();

        this.bitmap = bitmap;
    };

    private _renderCanvas_PIXI = super._renderCanvas;
    private _renderWebGL_PIXI = super._renderWebGL;

    /**
     * @method _renderCanvas
     * @param {Object} renderer
     * @private
     */
    _renderCanvas(renderer: PIXI.CanvasRenderer) {
        if (this._bitmap) {
            this._bitmap.touch();
        }
        if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
            this._renderCanvas_PIXI(renderer);
        }
    };

    /// bungcip: duplicate dengan yang dibawah
    // /**
    //  * @method _renderWebGL
    //  * @param {Object} renderer
    //  * @private
    //  */
    // _renderWebGL(renderer) {
    //     if (this._bitmap) {
    //         this._bitmap.touch();
    //     }
    //     if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
    //         if (this._bitmap) {
    //             this._bitmap.checkDirty();
    //         }
    //         this._renderWebGL_PIXI(renderer);
    //     }
    // };

    /**
     * The image for the tiling sprite.
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
            if (this._bitmap) {
                this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
            } else {
                this.texture.frame = Rectangle.emptyRectangle;
            }
        }
    }

    /**
     * The opacity of the tiling sprite (0 to 255).
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
     * Updates the tiling sprite for each frame.
     *
     * @method update
     */
    update() {
        this.children.forEach(function (child) {
            if ((child as any)['update']) {
                /// bungcip: rapikan... nanti
                (child as any).update();
            }
        });
    };

    /**
     * Sets the x, y, width, and height all at once.
     *
     * @method move
     * @param {Number} x The x coordinate of the tiling sprite
     * @param {Number} y The y coordinate of the tiling sprite
     * @param {Number} width The width of the tiling sprite
     * @param {Number} height The height of the tiling sprite
     */
    move(x: number, y: number, width: number, height: number) {
        this.x = x || 0;
        this.y = y || 0;
        this._width = width || 0;
        this._height = height || 0;
    };

    /**
     * Specifies the region of the image that the tiling sprite will use.
     *
     * @method setFrame
     * @param {Number} x The x coordinate of the frame
     * @param {Number} y The y coordinate of the frame
     * @param {Number} width The width of the frame
     * @param {Number} height The height of the frame
     */
    setFrame(x: number, y: number, width: number, height: number) {
        this._frame.x = x;
        this._frame.y = y;
        this._frame.width = width;
        this._frame.height = height;
        this._refresh();
    };

    /**
     * @method updateTransform
     * @private
     */
    updateTransform() {
        this.tilePosition.x = Math.round(-this.origin.x);
        this.tilePosition.y = Math.round(-this.origin.y);
        // this.updateTransformTS();
        super.updateTransform();
    };

    // updateTransformTS = super.updateTransform;;

    /**
     * @method _onBitmapLoad
     * @private
     */
    _onBitmapLoad() {
        this.texture.baseTexture = this._bitmap.baseTexture;
        this._refresh();
    };

    /**
     * @method _refresh
     * @private
     */
    _refresh() {
        var frame = this._frame.clone();
        if (frame.width === 0 && frame.height === 0 && this._bitmap) {
            frame.width = this._bitmap.width;
            frame.height = this._bitmap.height;
        }
        this.texture.frame = frame;
        
        /// bungcip: harus diberi any agar tidak error...
        (this.texture as any)._updateID++;

        this.tilingTexture = null;
    };


    _speedUpCustomBlendModes = Sprite.prototype._speedUpCustomBlendModes;

    /**
     * @method _renderWebGL
     * @param {Object} renderer
     * @private
     */
    _renderWebGL(renderer: PIXI.WebGLRenderer) {
        if (this._bitmap) {
            this._bitmap.touch();
            this._bitmap.checkDirty();
        }

        this._speedUpCustomBlendModes(renderer);

        this._renderWebGL_PIXI(renderer);
    };





}


// _renderCanvas_PIXI = PIXI.extras.Picture_renderCanvas;
// _renderWebGL_PIXI = PIXI.extras.Picture_renderWebGL;

// The important members from Pixi.js

/**
 * The visibility of the tiling sprite.
 *
 * @property visible
 * @type Boolean
 */

/**
 * The x coordinate of the tiling sprite.
 *
 * @property x
 * @type Number
 */

/**
 * The y coordinate of the tiling sprite.
 *
 * @property y
 * @type Number
 */
