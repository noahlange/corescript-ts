//-----------------------------------------------------------------------------

// we need this constant for some platforms (Samsung S4, S5, Tab4, HTC One H8)
PIXI.glCore.VertexArrayObject.FORCE_NATIVE = true;
PIXI.settings.GC_MODE = PIXI.GC_MODES.AUTO; //btw, this is default setting
PIXI.tilemap.TileRenderer.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.tilemap.TileRenderer.DO_CLEAR = true;

/**
 * The tilemap which displays 2D tile-based game map using shaders
 *
 * @class Tilemap
 * @constructor
 */
class ShaderTilemap extends Tilemap {
    protected _tileWidth: number;
    protected _tileHeight: number;

    public roundPixels: boolean = true;
    public lowerLayer: PIXI.tilemap.CompositeRectTileLayer;
    public upperLayer: PIXI.tilemap.CompositeRectTileLayer;

    /**
     * Uploads animation state in renderer
     *
     * @method _hackRenderer
     * @private
     */
    protected _hackRenderer(renderer: PIXI.WebGLRenderer) {
        let af = this.animationFrame % 4;
        if (af == 3) af = 1;
        (renderer.plugins as any).tilemap.tileAnim[0] = af * this._tileWidth;
        (renderer.plugins as any).tilemap.tileAnim[1] = (this.animationFrame % 3) * this._tileHeight;
        return renderer;
    };

    /**
     * PIXI render method
     *
     * @method renderWebGL
     * @param {Object} pixi renderer
     */
    renderWebGL(renderer: PIXI.WebGLRenderer) {
        this._hackRenderer(renderer);
        super.renderWebGL(renderer);
    };

    /**
     * Forces to repaint the entire tilemap AND update bitmaps list if needed
     *
     * @method refresh
     */
    protected _lastBitmapLength: number;
    refresh() {
        if (this._lastBitmapLength !== this.bitmaps.length) {
            this._lastBitmapLength = this.bitmaps.length;
            this.refreshTileset();
        };
        this._needsRepaint = true;
    };

    /**
     * Call after you update tileset
     *
     * @method updateBitmaps
     */
    refreshTileset() {
        const bitmaps = this.bitmaps.map(function (x: Bitmap) { 
            return x._baseTexture ? new PIXI.Texture(x._baseTexture) : x; 
        });
        this.lowerLayer.setBitmaps(bitmaps);
        this.upperLayer.setBitmaps(bitmaps);
    };

    /**
     * @method updateTransform
     * @private
     */
    updateTransform() {
        let ox, oy;
        if (this.roundPixels) {
            ox = Math.floor(this.origin.x);
            oy = Math.floor(this.origin.y);
        } else {
            ox = this.origin.x;
            oy = this.origin.y;
        }
        const startX = Math.floor((ox - this._margin) / this._tileWidth);
        const startY = Math.floor((oy - this._margin) / this._tileHeight);
        this._updateLayerPositions(startX, startY);
        if (this._needsRepaint ||
            this._lastStartX !== startX || this._lastStartY !== startY) {
            this._lastStartX = startX;
            this._lastStartY = startY;
            this._paintAllTiles(startX, startY);
            this._needsRepaint = false;
        }
        this._sortChildren();
        super.updateTransform();
    };

    /**
     * @method _createLayers
     * @private
     */
    public lowerZLayer: PIXI.tilemap.ZLayer;
    public upperZLayer: PIXI.tilemap.ZLayer;
    protected _createLayers() {
        const width = this._width;
        const height = this._height;
        const margin = this._margin;
        const tileCols = Math.ceil(width / this._tileWidth) + 1;
        const tileRows = Math.ceil(height / this._tileHeight) + 1;
        const layerWidth = this._layerWidth = tileCols * this._tileWidth;
        const layerHeight = this._layerHeight = tileRows * this._tileHeight;
        this._needsRepaint = true;

        if (!this.lowerZLayer) {
            //@hackerham: create layers only in initialization. Doesn't depend on width/height
            this.addChild(this.lowerZLayer = new PIXI.tilemap.ZLayer(this, 0));
            this.addChild(this.upperZLayer = new PIXI.tilemap.ZLayer(this, 4));

            const parameters = PluginManager.parameters('ShaderTilemap');
            const useSquareShader = Number(parameters.hasOwnProperty('squareShader') ? (parameters as any)['squareShader'] : 0);

            this.lowerZLayer.addChild(this.lowerLayer = new PIXI.tilemap.CompositeRectTileLayer(0, [], useSquareShader as any));
            this.lowerLayer.shadowColor = new Float32Array([0.0, 0.0, 0.0, 0.5]);
            this.upperZLayer.addChild(this.upperLayer = new PIXI.tilemap.CompositeRectTileLayer(4, [], useSquareShader as any));
        }
    };

    /**
     * @method _updateLayerPositions
     * @param {Number} startX
     * @param {Number} startY
     * @private
     */
    protected _updateLayerPositions(startX: number, startY: number) {
        let ox, oy;
        if (this.roundPixels) {
            ox = Math.floor(this.origin.x);
            oy = Math.floor(this.origin.y);
        } else {
            ox = this.origin.x;
            oy = this.origin.y;
        }
        this.lowerZLayer.position.x = startX * this._tileWidth - ox;
        this.lowerZLayer.position.y = startY * this._tileHeight - oy;
        this.upperZLayer.position.x = startX * this._tileWidth - ox;
        this.upperZLayer.position.y = startY * this._tileHeight - oy;
    };

    /**
     * @method _paintAllTiles
     * @param {Number} startX
     * @param {Number} startY
     * @private
     */
    protected _paintAllTiles(startX: number, startY: number) {
        this.lowerZLayer.clear();
        this.upperZLayer.clear();
        const tileCols = Math.ceil(this._width / this._tileWidth) + 1;
        const tileRows = Math.ceil(this._height / this._tileHeight) + 1;
        for (let y = 0; y < tileRows; y++) {
            for (let x = 0; x < tileCols; x++) {
                this._paintTiles(startX, startY, x, y);
            }
        }
    };

    /**
     * @method _paintTiles
     * @param {Number} startX
     * @param {Number} startY
     * @param {Number} x
     * @param {Number} y
     * @private
     */
    protected _paintTiles(startX: number, startY: number, x: number, y: number) {
        const mx = startX + x;
        const my = startY + y;
        const dx = x * this._tileWidth, dy = y * this._tileHeight;
        const tileId0 = this._readMapData(mx, my, 0);
        const tileId1 = this._readMapData(mx, my, 1);
        const tileId2 = this._readMapData(mx, my, 2);
        const tileId3 = this._readMapData(mx, my, 3);
        const shadowBits = this._readMapData(mx, my, 4);
        const upperTileId1 = this._readMapData(mx, my - 1, 1);
        const lowerLayer = this.lowerLayer.children[0];
        const upperLayer = this.upperLayer.children[0];

        if (this._isHigherTile(tileId0)) {
            this._drawTile(upperLayer, tileId0, dx, dy);
        } else {
            this._drawTile(lowerLayer, tileId0, dx, dy);
        }
        if (this._isHigherTile(tileId1)) {
            this._drawTile(upperLayer, tileId1, dx, dy);
        } else {
            this._drawTile(lowerLayer, tileId1, dx, dy);
        }

        this._drawShadow(lowerLayer, shadowBits, dx, dy);
        if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
            if (!Tilemap.isShadowingTile(tileId0)) {
                this._drawTableEdge(lowerLayer, upperTileId1, dx, dy);
            }
        }

        if (this._isOverpassPosition(mx, my)) {
            this._drawTile(upperLayer, tileId2, dx, dy);
            this._drawTile(upperLayer, tileId3, dx, dy);
        } else {
            if (this._isHigherTile(tileId2)) {
                this._drawTile(upperLayer, tileId2, dx, dy);
            } else {
                this._drawTile(lowerLayer, tileId2, dx, dy);
            }
            if (this._isHigherTile(tileId3)) {
                this._drawTile(upperLayer, tileId3, dx, dy);
            } else {
                this._drawTile(lowerLayer, tileId3, dx, dy);
            }
        }
    };

    /**
     * @method _drawTile
     * @param {Array} layers
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    protected _drawTile(layer: any, tileId: number, dx: number, dy: number) {
        if (Tilemap.isVisibleTile(tileId)) {
            if (Tilemap.isAutotile(tileId)) {
                this._drawAutotile(layer, tileId, dx, dy);
            } else {
                this._drawNormalTile(layer, tileId, dx, dy);
            }
        }
    };

    /**
     * @method _drawNormalTile
     * @param {Array} layers
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    protected _drawNormalTile(layer: any, tileId: number, dx: number, dy: number) {
        let setNumber = 0;

        if (Tilemap.isTileA5(tileId)) {
            setNumber = 4;
        } else {
            setNumber = 5 + Math.floor(tileId / 256);
        }

        const w = this._tileWidth;
        const h = this._tileHeight;
        const sx = (Math.floor(tileId / 128) % 2 * 8 + tileId % 8) * w;
        const sy = (Math.floor(tileId % 256 / 8) % 16) * h;

        layer.addRect(setNumber, sx, sy, dx, dy, w, h);
    };

    /**
     * @method _drawAutotile
     * @param {Array} layers
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    protected _drawAutotile(layer: any, tileId: number, dx: number, dy: number) {
        let autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
        const kind = Tilemap.getAutotileKind(tileId);
        const shape = Tilemap.getAutotileShape(tileId);
        const tx = kind % 8;
        const ty = Math.floor(kind / 8);
        let bx = 0;
        let by = 0;
        let setNumber = 0;
        let isTable = false;
        let animX = 0, animY = 0;

        if (Tilemap.isTileA1(tileId)) {
            setNumber = 0;
            if (kind === 0) {
                animX = 2;
                by = 0;
            } else if (kind === 1) {
                animX = 2;
                by = 3;
            } else if (kind === 2) {
                bx = 6;
                by = 0;
            } else if (kind === 3) {
                bx = 6;
                by = 3;
            } else {
                bx = Math.floor(tx / 4) * 8;
                by = ty * 6 + Math.floor(tx / 2) % 2 * 3;
                if (kind % 2 === 0) {
                    animX = 2;
                }
                else {
                    bx += 6;
                    autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
                    animY = 1;
                }
            }
        } else if (Tilemap.isTileA2(tileId)) {
            setNumber = 1;
            bx = tx * 2;
            by = (ty - 2) * 3;
            isTable = this._isTableTile(tileId);
        } else if (Tilemap.isTileA3(tileId)) {
            setNumber = 2;
            bx = tx * 2;
            by = (ty - 6) * 2;
            autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
        } else if (Tilemap.isTileA4(tileId)) {
            setNumber = 3;
            bx = tx * 2;
            by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
            if (ty % 2 === 1) {
                autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
            }
        }

        const table = autotileTable[shape];
        const w1 = this._tileWidth / 2;
        const h1 = this._tileHeight / 2;
        for (let i = 0; i < 4; i++) {
            const qsx = table[i][0];
            const qsy = table[i][1];
            const sx1 = (bx * 2 + qsx) * w1;
            const sy1 = (by * 2 + qsy) * h1;
            const dx1 = dx + (i % 2) * w1;
            const dy1 = dy + Math.floor(i / 2) * h1;
            if (isTable && (qsy === 1 || qsy === 5)) {
                let qsx2 = qsx;
                const qsy2 = 3;
                if (qsy === 1) {
                    //qsx2 = [0, 3, 2, 1][qsx];
                    qsx2 = (4 - qsx) % 4;
                }
                const sx2 = (bx * 2 + qsx2) * w1;
                const sy2 = (by * 2 + qsy2) * h1;
                layer.addRect(setNumber, sx2, sy2, dx1, dy1, w1, h1, animX, animY);
                layer.addRect(setNumber, sx1, sy1, dx1, dy1 + h1 / 2, w1, h1 / 2, animX, animY);
            } else {
                layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1, animX, animY);
            }
        }
    };

    /**
     * @method _drawTableEdge
     * @param {Array} layers
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    protected _drawTableEdge(layer: any, tileId: number, dx: number, dy: number) {
        if (Tilemap.isTileA2(tileId)) {
            const autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
            const kind = Tilemap.getAutotileKind(tileId);
            const shape = Tilemap.getAutotileShape(tileId);
            const tx = kind % 8;
            const ty = Math.floor(kind / 8);
            const setNumber = 1;
            const bx = tx * 2;
            const by = (ty - 2) * 3;
            const table = autotileTable[shape];
            const w1 = this._tileWidth / 2;
            const h1 = this._tileHeight / 2;
            for (let i = 0; i < 2; i++) {
                const qsx = table[2 + i][0];
                const qsy = table[2 + i][1];
                const sx1 = (bx * 2 + qsx) * w1;
                const sy1 = (by * 2 + qsy) * h1 + h1 / 2;
                const dx1 = dx + (i % 2) * w1;
                const dy1 = dy + Math.floor(i / 2) * h1;
                layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1 / 2);
            }
        }
    };

    /**
     * @method _drawShadow
     * @param {Number} shadowBits
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    protected _drawShadow(layer: any, shadowBits: number, dx: number, dy: number) {
        if (shadowBits & 0x0f) {
            const w1 = this._tileWidth / 2;
            const h1 = this._tileHeight / 2;
            for (let i = 0; i < 4; i++) {
                if (shadowBits & (1 << i)) {
                    const dx1 = dx + (i % 2) * w1;
                    const dy1 = dy + Math.floor(i / 2) * h1;
                    layer.addRect(-1, 0, 0, dx1, dy1, w1, h1);
                }
            }
        }
    };
}



