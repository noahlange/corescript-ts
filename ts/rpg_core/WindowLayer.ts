//-----------------------------------------------------------------------------
/**
 * The layer which contains game windows.
 *
 * @class WindowLayer
 * @constructor
 */
class WindowLayer extends PIXI.Container {
    protected _width: number = 0;
    protected _height: number = 0;
    protected _tempCanvas: any = null;
    protected _translationMatrix: number[] = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    protected _windowMask: PIXI.Graphics;
    protected _windowRect: any;
    protected _renderSprite: any;

    constructor() {
        super();

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

        const shift = new PIXI.Point();
        const rt = renderer._activeRenderTarget;
        const projectionMatrix = rt.projectionMatrix;
        shift.x = Math.round((projectionMatrix.tx + 1) / 2 * rt.sourceFrame.width);
        shift.y = Math.round((projectionMatrix.ty + 1) / 2 * rt.sourceFrame.height);

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i] as CoreWindow;
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

        for (let j = 0; j < this.children.length; j++) {
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
    protected _maskWindow(window: CoreWindow, shift: PIXI.Point) {
        (this._windowMask as any)['_currentBounds'] = null; // bungcip: edited to compile
        this._windowMask['boundsDirty'] = true as any; // bungcip: edited to compile
        const rect = this._windowRect;
        rect.x = this.x + shift.x + window.x;
        rect.y = this.x + shift.y + window.y + window.height / 2 * (1 - window._openness / 255);
        rect.width = window.width;
        rect.height = window.height * window._openness / 255;
    };

}
