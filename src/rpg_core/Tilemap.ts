import Bitmap from './Bitmap';
import Graphics from './Graphics';
import Sprite from './Sprite';
import TilingSprite from './TilingSprite';

/**
 * The tilemap which displays 2D tile-based game map.
 *
 * @class Tilemap
 * @constructor
 */
export default class Tilemap extends PIXI.Container {

  

  // Tile type checkers

  public static TILE_ID_B = 0;
  public static TILE_ID_C = 256;
  public static TILE_ID_D = 512;
  public static TILE_ID_E = 768;
  public static TILE_ID_A5 = 1536;
  public static TILE_ID_A1 = 2048;
  public static TILE_ID_A2 = 2816;
  public static TILE_ID_A3 = 4352;
  public static TILE_ID_A4 = 5888;
  public static TILE_ID_MAX = 8192;

  
  // Autotile shape number to coordinates of tileset images
  public static FLOOR_AUTOTILE_TABLE = [
    [[2, 4], [1, 4], [2, 3], [1, 3]],
    [[2, 0], [1, 4], [2, 3], [1, 3]],
    [[2, 4], [3, 0], [2, 3], [1, 3]],
    [[2, 0], [3, 0], [2, 3], [1, 3]],
    [[2, 4], [1, 4], [2, 3], [3, 1]],
    [[2, 0], [1, 4], [2, 3], [3, 1]],
    [[2, 4], [3, 0], [2, 3], [3, 1]],
    [[2, 0], [3, 0], [2, 3], [3, 1]],
    [[2, 4], [1, 4], [2, 1], [1, 3]],
    [[2, 0], [1, 4], [2, 1], [1, 3]],
    [[2, 4], [3, 0], [2, 1], [1, 3]],
    [[2, 0], [3, 0], [2, 1], [1, 3]],
    [[2, 4], [1, 4], [2, 1], [3, 1]],
    [[2, 0], [1, 4], [2, 1], [3, 1]],
    [[2, 4], [3, 0], [2, 1], [3, 1]],
    [[2, 0], [3, 0], [2, 1], [3, 1]],
    [[0, 4], [1, 4], [0, 3], [1, 3]],
    [[0, 4], [3, 0], [0, 3], [1, 3]],
    [[0, 4], [1, 4], [0, 3], [3, 1]],
    [[0, 4], [3, 0], [0, 3], [3, 1]],
    [[2, 2], [1, 2], [2, 3], [1, 3]],
    [[2, 2], [1, 2], [2, 3], [3, 1]],
    [[2, 2], [1, 2], [2, 1], [1, 3]],
    [[2, 2], [1, 2], [2, 1], [3, 1]],
    [[2, 4], [3, 4], [2, 3], [3, 3]],
    [[2, 4], [3, 4], [2, 1], [3, 3]],
    [[2, 0], [3, 4], [2, 3], [3, 3]],
    [[2, 0], [3, 4], [2, 1], [3, 3]],
    [[2, 4], [1, 4], [2, 5], [1, 5]],
    [[2, 0], [1, 4], [2, 5], [1, 5]],
    [[2, 4], [3, 0], [2, 5], [1, 5]],
    [[2, 0], [3, 0], [2, 5], [1, 5]],
    [[0, 4], [3, 4], [0, 3], [3, 3]],
    [[2, 2], [1, 2], [2, 5], [1, 5]],
    [[0, 2], [1, 2], [0, 3], [1, 3]],
    [[0, 2], [1, 2], [0, 3], [3, 1]],
    [[2, 2], [3, 2], [2, 3], [3, 3]],
    [[2, 2], [3, 2], [2, 1], [3, 3]],
    [[2, 4], [3, 4], [2, 5], [3, 5]],
    [[2, 0], [3, 4], [2, 5], [3, 5]],
    [[0, 4], [1, 4], [0, 5], [1, 5]],
    [[0, 4], [3, 0], [0, 5], [1, 5]],
    [[0, 2], [3, 2], [0, 3], [3, 3]],
    [[0, 2], [1, 2], [0, 5], [1, 5]],
    [[0, 4], [3, 4], [0, 5], [3, 5]],
    [[2, 2], [3, 2], [2, 5], [3, 5]],
    [[0, 2], [3, 2], [0, 5], [3, 5]],
    [[0, 0], [1, 0], [0, 1], [1, 1]]
  ];

  public static WALL_AUTOTILE_TABLE = [
    [[2, 2], [1, 2], [2, 1], [1, 1]],
    [[0, 2], [1, 2], [0, 1], [1, 1]],
    [[2, 0], [1, 0], [2, 1], [1, 1]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[2, 2], [3, 2], [2, 1], [3, 1]],
    [[0, 2], [3, 2], [0, 1], [3, 1]],
    [[2, 0], [3, 0], [2, 1], [3, 1]],
    [[0, 0], [3, 0], [0, 1], [3, 1]],
    [[2, 2], [1, 2], [2, 3], [1, 3]],
    [[0, 2], [1, 2], [0, 3], [1, 3]],
    [[2, 0], [1, 0], [2, 3], [1, 3]],
    [[0, 0], [1, 0], [0, 3], [1, 3]],
    [[2, 2], [3, 2], [2, 3], [3, 3]],
    [[0, 2], [3, 2], [0, 3], [3, 3]],
    [[2, 0], [3, 0], [2, 3], [3, 3]],
    [[0, 0], [3, 0], [0, 3], [3, 3]]
  ];

  public static WATERFALL_AUTOTILE_TABLE = [
    [[2, 0], [1, 0], [2, 1], [1, 1]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[2, 0], [3, 0], [2, 1], [3, 1]],
    [[0, 0], [3, 0], [0, 1], [3, 1]]
  ];

  public static isVisibleTile(tileId: number): boolean {
    return tileId > 0 && tileId < this.TILE_ID_MAX;
  }

  public static isAutotile(tileId: number): boolean {
    return tileId >= this.TILE_ID_A1;
  }

  public static getAutotileKind(tileId: number) {
    return Math.floor((tileId - this.TILE_ID_A1) / 48);
  }

  public static getAutotileShape(tileId: number) {
    return (tileId - this.TILE_ID_A1) % 48;
  }

  public static makeAutotileId(kind: number, shape: number) {
    return this.TILE_ID_A1 + kind * 48 + shape;
  }

  public static isSameKindTile(tileID1: number, tileID2: number): boolean {
    if (this.isAutotile(tileID1) && this.isAutotile(tileID2)) {
      return this.getAutotileKind(tileID1) === this.getAutotileKind(tileID2);
    } else {
      return tileID1 === tileID2;
    }
  }

  public static isTileA1(tileId: number): boolean {
    return tileId >= this.TILE_ID_A1 && tileId < this.TILE_ID_A2;
  }

  public static isTileA2(tileId: number): boolean {
    return tileId >= this.TILE_ID_A2 && tileId < this.TILE_ID_A3;
  }

  public static isTileA3(tileId: number): boolean {
    return tileId >= this.TILE_ID_A3 && tileId < this.TILE_ID_A4;
  }

  public static isTileA4(tileId: number): boolean {
    return tileId >= this.TILE_ID_A4 && tileId < this.TILE_ID_MAX;
  }

  public static isTileA5(tileId: number): boolean {
    return tileId >= this.TILE_ID_A5 && tileId < this.TILE_ID_A1;
  }

  public static isWaterTile(tileId: number): boolean {
    if (this.isTileA1(tileId)) {
      return !(
        tileId >= this.TILE_ID_A1 + 96 && tileId < this.TILE_ID_A1 + 192
      );
    } else {
      return false;
    }
  }

  public static isWaterfallTile(tileId: number): boolean {
    if (tileId >= this.TILE_ID_A1 + 192 && tileId < this.TILE_ID_A2) {
      return this.getAutotileKind(tileId) % 2 === 1;
    } else {
      return false;
    }
  }

  public static isGroundTile(tileId: number): boolean {
    return (
      this.isTileA1(tileId) || this.isTileA2(tileId) || this.isTileA5(tileId)
    );
  }

  public static isShadowingTile(tileId: number): boolean {
    return this.isTileA3(tileId) || this.isTileA4(tileId);
  }

  public static isRoofTile(tileId: number): boolean {
    return this.isTileA3(tileId) && this.getAutotileKind(tileId) % 16 < 8;
  }

  public static isWallTopTile(tileId: number): boolean {
    return this.isTileA4(tileId) && this.getAutotileKind(tileId) % 16 < 8;
  }

  public static isWallSideTile(tileId: number): boolean {
    return (
      (this.isTileA3(tileId) || this.isTileA4(tileId)) &&
      this.getAutotileKind(tileId) % 16 >= 8
    );
  }

  public static isWallTile(tileId: number): boolean {
    return this.isWallTopTile(tileId) || this.isWallSideTile(tileId);
  }

  public static isFloorTypeAutotile(tileId: number): boolean {
    return (
      (this.isTileA1(tileId) && !this.isWaterfallTile(tileId)) ||
      this.isTileA2(tileId) ||
      this.isWallTopTile(tileId)
    );
  }

  public static isWallTypeAutotile(tileId: number): boolean {
    return this.isRoofTile(tileId) || this.isWallSideTile(tileId);
  }

  public static isWaterfallTypeAutotile(tileId: number): boolean {
    return this.isWaterfallTile(tileId);
  }

  /**
   * The bitmaps used as a tileset.
   */
  public bitmaps: Bitmap[] = [];

  /**
   * The origin point of the tilemap for scrolling.
   */
  public origin: PIXI.Point = new PIXI.Point();

  /**
   * The tileset flags.
   */
  public flags: any[] = [];

  /**
   * The animation count for autotiles.
   */
  public animationCount: number = 0;

  /**
   * Whether the tilemap loops horizontal.
   */
  public horizontalWrap: boolean = false;

  /**
   * Whether the tilemap loops vertical.
   */
  public verticalWrap: boolean = false;

  /**
   * Updates the tilemap for each frame.
   */
  public animationFrame: number;

  protected _margin: number = 20;
  protected _width: number = Graphics.width + this._margin * 2;
  protected _height: number = Graphics.height + this._margin * 2;
  protected _tileWidth: number = 48;
  protected _tileHeight: number = 48;
  protected _mapWidth: number = 0;
  protected _mapHeight: number = 0;
  protected _mapData: null | any[] = null;
  protected _layerWidth: number = 0;
  protected _layerHeight: number = 0;
  protected _lastTiles: any[] = [];
  protected _needsRepaint: boolean;
  protected _lastAnimationFrame: any;
  protected _lastStartX: number;
  protected _lastStartY: number;
  protected _frameUpdated: boolean;
  protected _lowerBitmap: Bitmap;
  protected _upperBitmap: Bitmap;
  protected _lowerLayer: Sprite;
  protected _upperLayer: Sprite;


  constructor() {
    super();

    this._createLayers();
    this.refresh();
  }

  /**
   * The width of the screen in pixels.
   *
   * @property width
   * @type Number
   */
  get width(): number {
    return this._width;
  }
  set width(value) {
    if (this._width !== value) {
      this._width = value;
      this._createLayers();
    }
  }

  /**
   * The height of the screen in pixels.
   *
   * @property height
   * @type Number
   */
  get height(): number {
    return this._height;
  }
  set height(value) {
    if (this._height !== value) {
      this._height = value;
      this._createLayers();
    }
  }

  /**
   * The width of a tile in pixels.
   *
   * @property tileWidth
   * @type Number
   */
  get tileWidth(): number {
    return this._tileWidth;
  }
  set tileWidth(value) {
    if (this._tileWidth !== value) {
      this._tileWidth = value;
      this._createLayers();
    }
  }

  /**
   * The height of a tile in pixels.
   *
   * @property tileHeight
   * @type Number
   */
  get tileHeight(): number {
    return this._tileHeight;
  }

  set tileHeight(value) {
    if (this._tileHeight !== value) {
      this._tileHeight = value;
      this._createLayers();
    }
  }

  /**
   * Sets the tilemap data.
   */
  public setData(
    /** The width of the map in number of tiles */
    width: number,
    /** The height of the map in number of tiles */
    height: number,
    /** The one dimensional array for the map data */
    data: number[]
  ): void {
    this._mapWidth = width;
    this._mapHeight = height;
    this._mapData = data;
  }

  /**
   * Checks whether the tileset is ready to render.
   */
  public isReady(): boolean {
    for (const bitmap of this.bitmaps) {
      if (bitmap && !bitmap.isReady()) {
        return false;
      }
    }
    return true;
  }

  public update(): void {
    this.animationCount++;
    this.animationFrame = Math.floor(this.animationCount / 30);
    this.children.forEach(child => {
      if ((child as any).update) {
        (child as any).update();
      }
    });
    for (const bitmap of this.bitmaps) {
      if (bitmap) {
        bitmap.touch();
      }
    }
  }

  /**
   * Forces repaint of the entire tilemap.
   */
  public refresh(): void {
    this._lastTiles.length = 0;
  }

  /**
   * Forces to refresh the tileset
   *
   * @method refresh
   */
  public refreshTileset(): void {
    return;
  }

  /**
   * @method updateTransform
   * @private
   */
  public updateTransform() {
    const ox = Math.floor(this.origin.x);
    const oy = Math.floor(this.origin.y);
    const startX = Math.floor((ox - this._margin) / this._tileWidth);
    const startY = Math.floor((oy - this._margin) / this._tileHeight);
    this._updateLayerPositions(startX, startY);
    if (
      this._needsRepaint ||
      this._lastAnimationFrame !== this.animationFrame ||
      this._lastStartX !== startX ||
      this._lastStartY !== startY
    ) {
      this._frameUpdated = this._lastAnimationFrame !== this.animationFrame;
      this._lastAnimationFrame = this.animationFrame;
      this._lastStartX = startX;
      this._lastStartY = startY;
      this._paintAllTiles(startX, startY);
      this._needsRepaint = false;
    }
    this._sortChildren();
    super.updateTransform();
  }

  /**
   * @method _createLayers
   * @private
   */
  protected _createLayers() {
    const width = this._width;
    const height = this._height;
    const margin = this._margin;
    const tileCols = Math.ceil(width / this._tileWidth) + 1;
    const tileRows = Math.ceil(height / this._tileHeight) + 1;
    const layerWidth = tileCols * this._tileWidth;
    const layerHeight = tileRows * this._tileHeight;
    this._lowerBitmap = new Bitmap(layerWidth, layerHeight);
    this._upperBitmap = new Bitmap(layerWidth, layerHeight);
    this._layerWidth = layerWidth;
    this._layerHeight = layerHeight;

    /*
      * Z coordinate:
      *
      * 0 : Lower tiles
      * 1 : Lower characters
      * 3 : Normal characters
      * 4 : Upper tiles
      * 5 : Upper characters
      * 6 : Airship shadow
      * 7 : Balloon
      * 8 : Animation
      * 9 : Destination
      */

    this._lowerLayer = new Sprite();
    this._lowerLayer.move(-margin, -margin); /// bungcip: diedit
    (this._lowerLayer as any).z = 0;

    this._upperLayer = new Sprite();
    this._upperLayer.move(-margin, -margin); /// bungcip: diedit
    (this._upperLayer as any).z = 4;

    for (let i = 0; i < 4; i++) {
      this._lowerLayer.addChild(new Sprite(this._lowerBitmap));
      this._upperLayer.addChild(new Sprite(this._upperBitmap));
    }

    this.addChild(this._lowerLayer);
    this.addChild(this._upperLayer);
  }

  protected _updateLayerPositions(startX: number, startY: number) {
    const m = this._margin;
    const ox = Math.floor(this.origin.x);
    const oy = Math.floor(this.origin.y);
    const x2 = (ox - m).mod(this._layerWidth);
    const y2 = (oy - m).mod(this._layerHeight);
    const w1 = this._layerWidth - x2;
    const h1 = this._layerHeight - y2;
    const w2 = this._width - w1;
    const h2 = this._height - h1;

    for (let i = 0; i < 2; i++) {
      const children = (i === 0
        ? this._lowerLayer.children
        : this._upperLayer.children) as TilingSprite[];
      children[0].move(0, 0, w1, h1);
      children[0].setFrame(x2, y2, w1, h1);
      children[1].move(w1, 0, w2, h1);
      children[1].setFrame(0, y2, w2, h1);
      children[2].move(0, h1, w1, h2);
      children[2].setFrame(x2, 0, w1, h2);
      children[3].move(w1, h1, w2, h2);
      children[3].setFrame(0, 0, w2, h2);
    }
  }

  protected _paintAllTiles(startX: number, startY: number) {
    const tileCols = Math.ceil(this._width / this._tileWidth) + 1;
    const tileRows = Math.ceil(this._height / this._tileHeight) + 1;
    for (let y = 0; y < tileRows; y++) {
      for (let x = 0; x < tileCols; x++) {
        this._paintTiles(startX, startY, x, y);
      }
    }
  }

  protected _paintTiles(startX: number, startY: number, x: number, y: number) {
    const tableEdgeVirtualId = 10000;
    const mx = startX + x;
    const my = startY + y;
    const dx = (mx * this._tileWidth).mod(this._layerWidth);
    const dy = (my * this._tileHeight).mod(this._layerHeight);
    const lx = dx / this._tileWidth;
    const ly = dy / this._tileHeight;
    const tileId0 = this._readMapData(mx, my, 0);
    const tileId1 = this._readMapData(mx, my, 1);
    const tileId2 = this._readMapData(mx, my, 2);
    const tileId3 = this._readMapData(mx, my, 3);
    const shadowBits = this._readMapData(mx, my, 4);
    const upperTileId1 = this._readMapData(mx, my - 1, 1);
    const lowerTiles = [];
    const upperTiles = [];

    if (this._isHigherTile(tileId0)) {
      upperTiles.push(tileId0);
    } else {
      lowerTiles.push(tileId0);
    }
    if (this._isHigherTile(tileId1)) {
      upperTiles.push(tileId1);
    } else {
      lowerTiles.push(tileId1);
    }

    lowerTiles.push(-shadowBits);

    if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
      if (!Tilemap.isShadowingTile(tileId0)) {
        lowerTiles.push(tableEdgeVirtualId + upperTileId1);
      }
    }

    if (this._isOverpassPosition(mx, my)) {
      upperTiles.push(tileId2);
      upperTiles.push(tileId3);
    } else {
      if (this._isHigherTile(tileId2)) {
        upperTiles.push(tileId2);
      } else {
        lowerTiles.push(tileId2);
      }
      if (this._isHigherTile(tileId3)) {
        upperTiles.push(tileId3);
      } else {
        lowerTiles.push(tileId3);
      }
    }

    const lastLowerTiles = this._readLastTiles(0, lx, ly);
    if (
      !lowerTiles.equals(lastLowerTiles) ||
      (Tilemap.isTileA1(tileId0) && this._frameUpdated)
    ) {
      this._lowerBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
      for (const lowerTileId of lowerTiles) {
        if (lowerTileId < 0) {
          this._drawShadow(this._lowerBitmap, shadowBits, dx, dy);
        } else if (lowerTileId >= tableEdgeVirtualId) {
          this._drawTableEdge(this._lowerBitmap, upperTileId1, dx, dy);
        } else {
          this._drawTile(this._lowerBitmap, lowerTileId, dx, dy);
        }
      }
      this._writeLastTiles(0, lx, ly, lowerTiles);
    }

    const lastUpperTiles = this._readLastTiles(1, lx, ly);
    if (!upperTiles.equals(lastUpperTiles)) {
      this._upperBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
      for (const tile of upperTiles) {
        this._drawTile(this._upperBitmap, tile, dx, dy);
      }
      this._writeLastTiles(1, lx, ly, upperTiles);
    }
  }

  
  protected _readLastTiles(i: number, x: number, y: number) {
    const array1 = this._lastTiles[i];
    if (array1) {
      const array2 = array1[y];
      if (array2) {
        const tiles = array2[x];
        if (tiles) {
          return tiles;
        }
      }
    }
    return [];
  }

  
  protected _writeLastTiles(i: number, x: number, y: number, tiles: number[]) {
    let array1 = this._lastTiles[i];
    if (!array1) {
      array1 = this._lastTiles[i] = [];
    }
    let array2 = array1[y];
    if (!array2) {
      array2 = array1[y] = [];
    }
    array2[x] = tiles;
  }
  
  protected _drawTile(bitmap: Bitmap, tileId: number, dx: number, dy: number) {
    if (Tilemap.isVisibleTile(tileId)) {
      if (Tilemap.isAutotile(tileId)) {
        this._drawAutotile(bitmap, tileId, dx, dy);
      } else {
        this._drawNormalTile(bitmap, tileId, dx, dy);
      }
    }
  }

  protected _drawNormalTile(
    bitmap: Bitmap,
    tileId: number,
    dx: number,
    dy: number
  ) {
    const setNumber = Tilemap.isTileA5(tileId)
      ? 4
      : 5 + Math.floor(tileId / 256);
    const w = this._tileWidth;
    const h = this._tileHeight;
    const sx = ((Math.floor(tileId / 128) % 2) * 8 + tileId % 8) * w;
    const sy = (Math.floor((tileId % 256) / 8) % 16) * h;

    const source = this.bitmaps[setNumber];
    if (source) {
      bitmap.bltImage(source, sx, sy, w, h, dx, dy, w, h);
    }
  }

  /**
   * @method _drawAutotile
   * @param {Bitmap} bitmap
   * @param {Number} tileId
   * @param {Number} dx
   * @param {Number} dy
   * @private
   */
  protected _drawAutotile(
    bitmap: Bitmap,
    tileId: number,
    dx: number,
    dy: number
  ) {
    let autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
    const kind = Tilemap.getAutotileKind(tileId);
    const shape = Tilemap.getAutotileShape(tileId);
    const tx = kind % 8;
    const ty = Math.floor(kind / 8);
    let bx = 0;
    let by = 0;
    let setNumber = 0;
    let isTable: any = false;

    if (Tilemap.isTileA1(tileId)) {
      const waterSurfaceIndex = [0, 1, 2, 1][this.animationFrame % 4];
      setNumber = 0;
      if (kind === 0) {
        bx = waterSurfaceIndex * 2;
        by = 0;
      } else if (kind === 1) {
        bx = waterSurfaceIndex * 2;
        by = 3;
      } else if (kind === 2) {
        bx = 6;
        by = 0;
      } else if (kind === 3) {
        bx = 6;
        by = 3;
      } else {
        bx = Math.floor(tx / 4) * 8;
        by = ty * 6 + (Math.floor(tx / 2) % 2) * 3;
        if (kind % 2 === 0) {
          bx += waterSurfaceIndex * 2;
        } else {
          bx += 6;
          autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
          by += this.animationFrame % 3;
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
    const source = this.bitmaps[setNumber];

    if (table && source) {
      const w1 = this._tileWidth / 2;
      const h1 = this._tileHeight / 2;
      for (let i = 0; i < 4; i++) {
        const qsx = table[i][0];
        const qsy = table[i][1];
        const sx1 = (bx * 2 + qsx) * w1;
        const sy1 = (by * 2 + qsy) * h1;
        const dx1 = dx + (i % 2) * w1;
        let dy1 = dy + Math.floor(i / 2) * h1;
        if (isTable && (qsy === 1 || qsy === 5)) {
          let qsx2 = qsx;
          const qsy2 = 3;
          if (qsy === 1) {
            qsx2 = [0, 3, 2, 1][qsx];
          }
          const sx2 = (bx * 2 + qsx2) * w1;
          const sy2 = (by * 2 + qsy2) * h1;
          bitmap.bltImage(source, sx2, sy2, w1, h1, dx1, dy1, w1, h1);
          dy1 += h1 / 2;
          bitmap.bltImage(source, sx1, sy1, w1, h1 / 2, dx1, dy1, w1, h1 / 2);
        } else {
          bitmap.bltImage(source, sx1, sy1, w1, h1, dx1, dy1, w1, h1);
        }
      }
    }
  }

  /**
   * @method _drawTableEdge
   * @param {Bitmap} bitmap
   * @param {Number} tileId
   * @param {Number} dx
   * @param {Number} dy
   * @private
   */
  protected _drawTableEdge(
    bitmap: Bitmap,
    tileId: number,
    dx: number,
    dy: number
  ) {
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

      if (table) {
        const source = this.bitmaps[setNumber];
        const w1 = this._tileWidth / 2;
        const h1 = this._tileHeight / 2;
        for (let i = 0; i < 2; i++) {
          const qsx = table[2 + i][0];
          const qsy = table[2 + i][1];
          const sx1 = (bx * 2 + qsx) * w1;
          const sy1 = (by * 2 + qsy) * h1 + h1 / 2;
          const dx1 = dx + (i % 2) * w1;
          const dy1 = dy + Math.floor(i / 2) * h1;
          bitmap.bltImage(source, sx1, sy1, w1, h1 / 2, dx1, dy1, w1, h1 / 2);
        }
      }
    }
  }

  /**
   * @method _drawShadow
   * @param {Bitmap} bitmap
   * @param {Number} shadowBits
   * @param {Number} dx
   * @param {Number} dy
   * @private
   */
  protected _drawShadow(
    bitmap: Bitmap,
    shadowBits: number,
    dx: number,
    dy: number
  ) {
    if (shadowBits & 0x0f) {
      const w1 = this._tileWidth / 2;
      const h1 = this._tileHeight / 2;
      const color = 'rgba(0,0,0,0.5)';
      for (let i = 0; i < 4; i++) {
        if (shadowBits & (1 << i)) {
          const dx1 = dx + (i % 2) * w1;
          const dy1 = dy + Math.floor(i / 2) * h1;
          bitmap.fillRect(dx1, dy1, w1, h1, color);
        }
      }
    }
  }

  /**
   * @method _readMapData
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   * @return {Number}
   * @private
   */
  protected _readMapData(x: number, y: number, z: number): number {
    if (this._mapData) {
      const width = this._mapWidth;
      const height = this._mapHeight;
      if (this.horizontalWrap) {
        x = x.mod(width);
      }
      if (this.verticalWrap) {
        y = y.mod(height);
      }
      if (x >= 0 && x < width && y >= 0 && y < height) {
        return this._mapData[(z * height + y) * width + x] || 0;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  /**
   * @method _isHigherTile
   * @param {Number} tileId
   * @return {Boolean}
   * @private
   */
  protected _isHigherTile(tileId: number): boolean {
    return (this.flags[tileId] & 0x10) != 0;
  }

  /**
   * @method _isTableTile
   * @param {Number} tileId
   * @return {Boolean}
   * @private
   */
  protected _isTableTile(tileId: number): boolean {
    return Tilemap.isTileA2(tileId) && (this.flags[tileId] & 0x80) != 0;
  }

  /**
   * @method _isOverpassPosition
   * @param {Number} mx
   * @param {Number} my
   * @return {Boolean}
   * @private
   */
  protected _isOverpassPosition(mx: number, my: number): boolean {
    return false;
  }

  /**
   * @method _sortChildren
   * @private
   */
  protected _sortChildren() {
    this.children.sort(this._compareChildOrder.bind(this));
  }

  /**
   * @method _compareChildOrder
   * @param {Object} a
   * @param {Object} b
   * @private
   */
  protected _compareChildOrder(a: any, b: any) {
    if (a.z !== b.z) {
      return a.z - b.z;
    } else if (a.y !== b.y) {
      return a.y - b.y;
    } else {
      return a.spriteId - b.spriteId;
    }
  }
}
