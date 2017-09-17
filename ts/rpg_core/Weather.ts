//-----------------------------------------------------------------------------
/**
 * The weather effect which displays rain, storm, or snow.
 *
 * @class Weather
 * @constructor
 */
class Weather extends PIXI.Container {

    protected _width: number;
    protected _height: number;
    protected _sprites: any[];

    protected type: string;
    protected power: number;
    protected origin: Point;

    protected _rainBitmap : Bitmap;
    protected _stormBitmap: Bitmap;
    protected _snowBitmap: Bitmap;

    protected _dimmerSprite: ScreenSprite;

    
    /// bungcip: viewport itu tidak ada? sementara didefinisikan dulu....
    public viewport;
    

    constructor() {
        super();

        this._width = Graphics.width;
        this._height = Graphics.height;
        this._sprites = [];

        this._createBitmaps();
        this._createDimmer();

        /**
         * The type of the weather in ['none', 'rain', 'storm', 'snow'].
         *
         * @property type
         * @type String
         */
        this.type = 'none';

        /**
         * The power of the weather in the range (0, 9).
         *
         * @property power
         * @type Number
         */
        this.power = 0;

        /**
         * The origin point of the weather for scrolling.
         *
         * @property origin
         * @type Point
         */
        this.origin = new Point();
    };

    /**
     * Updates the weather for each frame.
     *
     * @method update
     */
    update() {
        this._updateDimmer();
        this._updateAllSprites();
    };

    /**
     * @method _createBitmaps
     * @private
     */
    protected _createBitmaps() {
        this._rainBitmap = new Bitmap(1, 60);
        this._rainBitmap.fillAll('white');
        this._stormBitmap = new Bitmap(2, 100);
        this._stormBitmap.fillAll('white');
        this._snowBitmap = new Bitmap(9, 9);
        this._snowBitmap.drawCircle(4, 4, 4, 'white');
    };

    /**
     * @method _createDimmer
     * @private
     */
    protected _createDimmer() {
        this._dimmerSprite = new ScreenSprite();
        this._dimmerSprite.setColor(80, 80, 80);
        this.addChild(this._dimmerSprite);
    };

    /**
     * @method _updateDimmer
     * @private
     */
    protected _updateDimmer() {
        this._dimmerSprite.opacity = Math.floor(this.power * 6);
    };

    /**
     * @method _updateAllSprites
     * @private
     */
    protected _updateAllSprites() {
        var maxSprites = Math.floor(this.power * 10);
        while (this._sprites.length < maxSprites) {
            this._addSprite();
        }
        while (this._sprites.length > maxSprites) {
            this._removeSprite();
        }
        this._sprites.forEach(function (sprite) {
            this._updateSprite(sprite);
            sprite.x = sprite.ax - this.origin.x;
            sprite.y = sprite.ay - this.origin.y;
        }, this);
    };

    /**
     * @method _addSprite
     * @private
     */
    protected _addSprite() {
        /// bungcip: viewport itu tidak ada? sementara didefinisikan dulu....
        var sprite = new Sprite(this.viewport);
        sprite.opacity = 0;
        this._sprites.push(sprite);
        this.addChild(sprite);
    };

    /**
     * @method _removeSprite
     * @private
     */
    protected _removeSprite() {
        this.removeChild(this._sprites.pop());
    };

    /**
     * @method _updateSprite
     * @param {Sprite} sprite
     * @private
     */
    protected _updateSprite(sprite: Sprite) {
        switch (this.type) {
            case 'rain':
                this._updateRainSprite(sprite);
                break;
            case 'storm':
                this._updateStormSprite(sprite);
                break;
            case 'snow':
                this._updateSnowSprite(sprite);
                break;
        }
        if (sprite.opacity < 40) {
            this._rebornSprite(sprite);
        }
    };

    /**
     * @method _updateRainSprite
     * @param {Sprite} sprite
     * @private
     */
    protected _updateRainSprite(sprite) {
        sprite.bitmap = this._rainBitmap;
        sprite.rotation = Math.PI / 16;
        sprite.ax -= 6 * Math.sin(sprite.rotation);
        sprite.ay += 6 * Math.cos(sprite.rotation);
        sprite.opacity -= 6;
    };

    /**
     * @method _updateStormSprite
     * @param {Sprite} sprite
     * @private
     */
    protected _updateStormSprite(sprite) {
        sprite.bitmap = this._stormBitmap;
        sprite.rotation = Math.PI / 8;
        sprite.ax -= 8 * Math.sin(sprite.rotation);
        sprite.ay += 8 * Math.cos(sprite.rotation);
        sprite.opacity -= 8;
    };

    /**
     * @method _updateSnowSprite
     * @param {Sprite} sprite
     * @private
     */
    protected _updateSnowSprite(sprite) {
        sprite.bitmap = this._snowBitmap;
        sprite.rotation = Math.PI / 16;
        sprite.ax -= 3 * Math.sin(sprite.rotation);
        sprite.ay += 3 * Math.cos(sprite.rotation);
        sprite.opacity -= 3;
    };

    /**
     * @method _rebornSprite
     * @param {Sprite} sprite
     * @private
     */
    protected _rebornSprite(sprite) {
        sprite.ax = Math.randomInt(Graphics.width + 100) - 100 + this.origin.x;
        sprite.ay = Math.randomInt(Graphics.height + 200) - 200 + this.origin.y;
        sprite.opacity = 160 + Math.randomInt(60);
    };


}


