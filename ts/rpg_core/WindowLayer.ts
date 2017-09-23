//-----------------------------------------------------------------------------
/**
 * The layer which contains game windows.
 *
 * @class WindowLayer
 * @constructor
 */
class WindowLayer extends PIXI.Container {
    protected _width: number;
    protected _height: number;
    protected _tempCanvas: any;
    protected _translationMatrix: number[];
    protected _windowMask: PIXI.Graphics;
    protected _windowRect: any;
    protected _renderSprite: any;

    constructor() {
        super();

        this._width = 0;
        this._height = 0;
        this._tempCanvas = null;
        this._translationMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];

        this._windowMask = new PIXI.Graphics();
        this._windowMask.beginFill(0xffffff, 1);
        this._windowMask.drawRect(0, 0, 0, 0);
        this._windowMask.endFill();
        /// bungcip: jadi any agar tidak error
        this._windowRect = (this._windowMask as any).graphicsData[0].shape;

        this._renderSprite = null;
        this.filterArea = new PIXI.Rectangle();
        this.filters = [WindowLayer.voidFilter];

        //temporary fix for memory leak bug
        this.on('removed', this.onRemoveAsAChild);
    };

    onRemoveAsAChild() {
        this.removeChildren();
    }

    static voidFilter = new PIXI.filters.VoidFilter();

    /**
     * The width of the window layer in pixels.
     *
     * @property width
     * @type Number
     */
    get width(): number {
        return this._width;
    }
    set width(value) {
        this._width = value;
    }

    /**
     * The height of the window layer in pixels.
     *
     * @property height
     * @type Number
     */
    get height(): number {
        return this._height;
    }
    set height(value) {
        this._height = value;
    }

    /**
     * Sets the x, y, width, and height all at once.
     *
     * @method move
     * @param {Number} x The x coordinate of the window layer
     * @param {Number} y The y coordinate of the window layer
     * @param {Number} width The width of the window layer
     * @param {Number} height The height of the window layer
     */
    move(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };

    /**
     * Updates the window layer for each frame.
     *
     * @method update
     */
    update() {
        this.children.forEach(function (child) {
            if ((child as any)['update']) {
                /// bungcip: jadi any agar bisa dipanggil
                (child as any).update();
            }
        });
    };

    /**
     * @method _renderCanvas
     * @param {Object} renderSession
     * @private
     */
    renderCanvas(renderer: PIXI.CanvasRenderer) {
        if (!this.visible || !this.renderable) {
            return;
        }

        if (!this._tempCanvas) {
            this._tempCanvas = document.createElement('canvas');
        }

        this._tempCanvas.width = Graphics.width;
        this._tempCanvas.height = Graphics.height;

        var realCanvasContext = renderer.context;
        var context = this._tempCanvas.getContext('2d');

        context.save();
        context.clearRect(0, 0, Graphics.width, Graphics.height);
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.closePath();
        context.clip();

        renderer.context = context;

        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i] as CoreWindow;
            /// bungcip: ada any agar bisa dicompile
            if ((child as any)._isWindow && child.visible && (child as any).openness > 0) {
                this._canvasClearWindowRect(renderer, child);
                context.save();
                child.renderCanvas(renderer);
                context.restore();
            }
        }

        context.restore();

        renderer.context = realCanvasContext;
        renderer.context.setTransform(1, 0, 0, 1, 0, 0);
        renderer.context.globalCompositeOperation = 'source-over';
        renderer.context.globalAlpha = 1;
        renderer.context.drawImage(this._tempCanvas, 0, 0);

        for (var j = 0; j < this.children.length; j++) {
            /// bungcip: ada any agar bisa dicompile
            if (!(this.children[j] as any)._isWindow) {
                this.children[j].renderCanvas(renderer);
            }
        }
    };

    /**
     * @method _canvasClearWindowRect
     * @param {Object} renderSession
     * @param {Window} window
     * @private
     */
    protected _canvasClearWindowRect(renderSession: any, window: CoreWindow) {
        var rx = this.x + window.x;
        var ry = this.y + window.y + window.height / 2 * (1 - window._openness / 255);
        var rw = window.width;
        var rh = window.height * window._openness / 255;
        renderSession.context.clearRect(rx, ry, rw, rh);
    };

    /**
     * @method _renderWebGL
     * @param {Object} renderSession
     * @private
     */
    renderWebGL(renderer: PIXI.WebGLRenderer) {
        if (!this.visible || !this.renderable) {
            return;
        }

        if (this.children.length == 0) {
            return;
        }

        renderer.flush();
        this.filterArea.copy(this as any);
        renderer.filterManager.pushFilter(this as any, this.filters);
        renderer.currentRenderer.start();

        var shift = new PIXI.Point();
        var rt = renderer._activeRenderTarget;
        var projectionMatrix = rt.projectionMatrix;
        shift.x = Math.round((projectionMatrix.tx + 1) / 2 * rt.sourceFrame.width);
        shift.y = Math.round((projectionMatrix.ty + 1) / 2 * rt.sourceFrame.height);

        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i] as CoreWindow;
            /// bungcip: ada any agar bisa dicompile
            if ((child as any)._isWindow && child.visible && (child as any).openness > 0) {
                this._maskWindow(child, shift);
                renderer.maskManager.pushScissorMask(this as any, this._windowMask);
                renderer.clear();
                renderer.maskManager.popScissorMask();
                renderer.currentRenderer.start();
                child.renderWebGL(renderer);
                renderer.currentRenderer.flush();
            }
        }

        renderer.flush();
        renderer.filterManager.popFilter();
        renderer.maskManager.popScissorMask();

        for (var j = 0; j < this.children.length; j++) {
            /// bungcip: ada any agar bisa dicompile
            if (!(this.children[j] as any)._isWindow) {
                this.children[j].renderWebGL(renderer);
            }
        }
    };

    /**
     * @method _maskWindow
     * @param {Window} window
     * @private
     */
    protected _maskWindow(window: CoreWindow, shift: Point) {
        (this._windowMask as any)['_currentBounds'] = null; // bungcip: edited to compile
        this._windowMask['boundsDirty'] = true as any; // bungcip: edited to compile
        var rect = this._windowRect;
        rect.x = this.x + shift.x + window.x;
        rect.y = this.x + shift.y + window.y + window.height / 2 * (1 - window._openness / 255);
        rect.width = window.width;
        rect.height = window.height * window._openness / 255;
    };

}




// The important members from Pixi.js

/**
 * The x coordinate of the window layer.
 *
 * @property x
 * @type Number
 */

/**
 * The y coordinate of the window layer.
 *
 * @property y
 * @type Number
 */

/**
 * [read-only] The array of children of the window layer.
 *
 * @property children
 * @type Array
 */

/**
 * [read-only] The object that contains the window layer.
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
