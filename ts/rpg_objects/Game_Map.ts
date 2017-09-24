//-----------------------------------------------------------------------------
// Game_Map
//
// The game object class for a map. It contains scrolling and passage
// determination functions.

class Game_Map {
    protected _interpreter: Game_Interpreter;
    protected _mapId: number = 0;
    protected _tilesetId: number = 0;
    protected _events: Game_Event[] = [];
    protected _commonEvents: Game_CommonEvent[] = [];
    protected _vehicles: Game_Vehicle[] = [];
    protected _displayX: number = 0;
    protected _displayY: number = 0;
    protected _nameDisplay: boolean = true;
    protected _scrollDirection: number = 2;
    protected _scrollRest: number = 0;
    protected _scrollSpeed: number = 4;
    protected _parallaxName: string = '';
    protected _parallaxZero: boolean = false;
    protected _parallaxLoopX: boolean = false;
    protected _parallaxLoopY: boolean = false;
    protected _parallaxSx: number = 0;
    protected _parallaxSy: number = 0;
    protected _parallaxX: number = 0;
    protected _parallaxY: number = 0;
    protected _battleback1Name: string | null = null;
    protected _battleback2Name: string | null = null;
    protected _needsRefresh: boolean;

    public tileEvents: Game_Event[];


    constructor() {
        this._interpreter = new Game_Interpreter();
        // this._mapId = 0;
        // this._tilesetId = 0;
        // this._events = [];
        // this._commonEvents = [];
        // this._vehicles = [];
        // this._displayX = 0;
        // this._displayY = 0;
        // this._nameDisplay = true;
        // this._scrollDirection = 2;
        // this._scrollRest = 0;
        // this._scrollSpeed = 4;
        // this._parallaxName = '';
        // this._parallaxZero = false;
        // this._parallaxLoopX = false;
        // this._parallaxLoopY = false;
        // this._parallaxSx = 0;
        // this._parallaxSy = 0;
        // this._parallaxX = 0;
        // this._parallaxY = 0;
        // this._battleback1Name = null;
        // this._battleback2Name = null;
        this.createVehicles();
    };

    setup(mapId: number) {
        if (!$dataMap) {
            throw new Error('The map data is not available');
        }
        this._mapId = mapId;
        this._tilesetId = $dataMap.tilesetId;
        this._displayX = 0;
        this._displayY = 0;
        this.refereshVehicles();
        this.setupEvents();
        this.setupScroll();
        this.setupParallax();
        this.setupBattleback();
        this._needsRefresh = false;
    };

    isEventRunning(): boolean {
        return this._interpreter.isRunning() || this.isAnyEventStarting();
    };

    tileWidth(): number {
        return 48;
    };

    tileHeight(): number {
        return 48;
    };

    mapId(): number {
        return this._mapId;
    };

    tilesetId(): number {
        return this._tilesetId;
    };

    displayX(): number {
        return this._displayX;
    };

    displayY(): number {
        return this._displayY;
    };

    parallaxName() {
        return this._parallaxName;
    };

    battleback1Name() {
        return this._battleback1Name;
    };

    battleback2Name() {
        return this._battleback2Name;
    };

    requestRefresh(mapId?: number) {
        this._needsRefresh = true;
    };

    isNameDisplayEnabled(): boolean {
        return this._nameDisplay;
    };

    disableNameDisplay() {
        this._nameDisplay = false;
    };

    enableNameDisplay() {
        this._nameDisplay = true;
    };

    createVehicles() {
        this._vehicles = [];
        this._vehicles[0] = new Game_Vehicle('boat');
        this._vehicles[1] = new Game_Vehicle('ship');
        this._vehicles[2] = new Game_Vehicle('airship');
    };

    refereshVehicles() {
        this._vehicles.forEach(function (vehicle) {
            vehicle.refresh();
        });
    };

    vehicles() {
        return this._vehicles;
    };

    vehicle(type: number | string): Game_Vehicle | null {
        if (type === 0 || type === 'boat') {
            return this.boat();
        } else if (type === 1 || type === 'ship') {
            return this.ship();
        } else if (type === 2 || type === 'airship') {
            return this.airship();
        } else {
            return null;
        }
    };

    boat() {
        return this._vehicles[0];
    };

    ship() {
        return this._vehicles[1];
    };

    airship() {
        return this._vehicles[2];
    };

    setupEvents() {
        this._events = [];
        for (var i = 0; i < $dataMap.events.length; i++) {
            if ($dataMap.events[i]) {
                this._events[i] = new Game_Event(this._mapId, i);
            }
        }
        this._commonEvents = this.parallelCommonEvents().map(function (commonEvent) {
            return new Game_CommonEvent(commonEvent.id);
        });
        this.refreshTileEvents();
    };

    events() {
        return this._events.filter(function (event) {
            return !!event;
        });
    };

    event(eventId: number) {
        return this._events[eventId];
    };

    eraseEvent(eventId: number) {
        this._events[eventId].erase();
    };

    parallelCommonEvents() {
        return $dataCommonEvents.filter(function (commonEvent) {
            return commonEvent && commonEvent.trigger === 2;
        });
    };

    setupScroll() {
        this._scrollDirection = 2;
        this._scrollRest = 0;
        this._scrollSpeed = 4;
    };

    setupParallax() {
        this._parallaxName = $dataMap.parallaxName || '';
        this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
        this._parallaxLoopX = $dataMap.parallaxLoopX;
        this._parallaxLoopY = $dataMap.parallaxLoopY;
        this._parallaxSx = $dataMap.parallaxSx;
        this._parallaxSy = $dataMap.parallaxSy;
        this._parallaxX = 0;
        this._parallaxY = 0;
    };

    setupBattleback() {
        if ($dataMap.specifyBattleback) {
            this._battleback1Name = $dataMap.battleback1Name;
            this._battleback2Name = $dataMap.battleback2Name;
        } else {
            this._battleback1Name = null;
            this._battleback2Name = null;
        }
    };

    setDisplayPos(x: number, y: number) {
        if (this.isLoopHorizontal()) {
            this._displayX = x.mod(this.width());
            this._parallaxX = x;
        } else {
            var endX = this.width() - this.screenTileX();
            this._displayX = endX < 0 ? endX / 2 : x.clamp(0, endX);
            this._parallaxX = this._displayX;
        }
        if (this.isLoopVertical()) {
            this._displayY = y.mod(this.height());
            this._parallaxY = y;
        } else {
            var endY = this.height() - this.screenTileY();
            this._displayY = endY < 0 ? endY / 2 : y.clamp(0, endY);
            this._parallaxY = this._displayY;
        }
    };

    parallaxOx() {
        if (this._parallaxZero) {
            return this._parallaxX * this.tileWidth();
        } else if (this._parallaxLoopX) {
            return this._parallaxX * this.tileWidth() / 2;
        } else {
            return 0;
        }
    };

    parallaxOy() {
        if (this._parallaxZero) {
            return this._parallaxY * this.tileHeight();
        } else if (this._parallaxLoopY) {
            return this._parallaxY * this.tileHeight() / 2;
        } else {
            return 0;
        }
    };

    tileset() {
        return $dataTilesets[this._tilesetId];
    };

    tilesetFlags() {
        var tileset = this.tileset();
        if (tileset) {
            return tileset.flags;
        } else {
            return [];
        }
    };

    displayName() {
        return $dataMap.displayName;
    };

    width(): number {
        return $dataMap.width;
    };

    height(): number {
        return $dataMap.height;
    };

    data() {
        return $dataMap.data;
    };

    isLoopHorizontal() {
        return $dataMap.scrollType === 2 || $dataMap.scrollType === 3;
    };

    isLoopVertical() {
        return $dataMap.scrollType === 1 || $dataMap.scrollType === 3;
    };

    isDashDisabled() {
        return $dataMap.disableDashing;
    };

    encounterList() {
        return $dataMap.encounterList;
    };

    encounterStep() {
        return $dataMap.encounterStep;
    };

    isOverworld() {
        return this.tileset() && this.tileset().mode === 0;
    };

    screenTileX(): number {
        return Graphics.width / this.tileWidth();
    };

    screenTileY(): number {
        return Graphics.height / this.tileHeight();
    };

    adjustX(x: number) {
        if (this.isLoopHorizontal() && x < this._displayX -
            (this.width() - this.screenTileX()) / 2) {
            return x - this._displayX + $dataMap.width;
        } else {
            return x - this._displayX;
        }
    };

    adjustY(y: number) {
        if (this.isLoopVertical() && y < this._displayY -
            (this.height() - this.screenTileY()) / 2) {
            return y - this._displayY + $dataMap.height;
        } else {
            return y - this._displayY;
        }
    };

    roundX(x: number) {
        return this.isLoopHorizontal() ? x.mod(this.width()) : x;
    };

    roundY(y: number) {
        return this.isLoopVertical() ? y.mod(this.height()) : y;
    };

    xWithDirection(x: number, d: number) {
        return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
    };

    yWithDirection(y: number, d: number) {
        return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
    };

    roundXWithDirection(x: number, d: number) {
        return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
    };

    roundYWithDirection(y: number, d: number) {
        return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
    };

    deltaX(x1: number, x2: number) {
        var result = x1 - x2;
        if (this.isLoopHorizontal() && Math.abs(result) > this.width() / 2) {
            if (result < 0) {
                result += this.width();
            } else {
                result -= this.width();
            }
        }
        return result;
    };

    deltaY(y1: number, y2: number) {
        var result = y1 - y2;
        if (this.isLoopVertical() && Math.abs(result) > this.height() / 2) {
            if (result < 0) {
                result += this.height();
            } else {
                result -= this.height();
            }
        }
        return result;
    };

    distance(x1: number, y1: number, x2: number, y2: number) {
        return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
    };

    canvasToMapX(x: number) {
        var tileWidth = this.tileWidth();
        var originX = this._displayX * tileWidth;
        var mapX = Math.floor((originX + x) / tileWidth);
        return this.roundX(mapX);
    };

    canvasToMapY(y: number) {
        var tileHeight = this.tileHeight();
        var originY = this._displayY * tileHeight;
        var mapY = Math.floor((originY + y) / tileHeight);
        return this.roundY(mapY);
    };

    autoplay() {
        if ($dataMap.autoplayBgm) {
            if ($gamePlayer.isInVehicle()) {
                $gameSystem.saveWalkingBgm2();
            } else {
                AudioManager.playBgm($dataMap.bgm);
            }
        }
        if ($dataMap.autoplayBgs) {
            AudioManager.playBgs($dataMap.bgs);
        }
    };

    refreshIfNeeded() {
        if (this._needsRefresh) {
            this.refresh();
        }
    };

    refresh() {
        this.events().forEach(function (event) {
            event.refresh();
        });
        this._commonEvents.forEach(function (event) {
            event.refresh();
        });
        this.refreshTileEvents();
        this._needsRefresh = false;
    };

    refreshTileEvents() {
        this.tileEvents = this.events().filter(function (event) {
            return event.isTile();
        });
    };

    eventsXy(x: number, y: number) {
        return this.events().filter(function (event) {
            return event.pos(x, y);
        });
    };

    eventsXyNt(x: number, y: number) {
        return this.events().filter(function (event) {
            return event.posNt(x, y);
        });
    };

    tileEventsXy(x: number, y: number) {
        return this.tileEvents.filter(function (event) {
            return event.posNt(x, y);
        });
    };

    eventIdXy(x: number, y: number) {
        var list = this.eventsXy(x, y);
        return list.length === 0 ? 0 : list[0].eventId();
    };

    scrollDown(distance: number) {
        if (this.isLoopVertical()) {
            this._displayY += distance;
            this._displayY %= $dataMap.height;
            if (this._parallaxLoopY) {
                this._parallaxY += distance;
            }
        } else if (this.height() >= this.screenTileY()) {
            var lastY = this._displayY;
            this._displayY = Math.min(this._displayY + distance,
                this.height() - this.screenTileY());
            this._parallaxY += this._displayY - lastY;
        }
    };

    scrollLeft(distance: number) {
        if (this.isLoopHorizontal()) {
            this._displayX += $dataMap.width - distance;
            this._displayX %= $dataMap.width;
            if (this._parallaxLoopX) {
                this._parallaxX -= distance;
            }
        } else if (this.width() >= this.screenTileX()) {
            var lastX = this._displayX;
            this._displayX = Math.max(this._displayX - distance, 0);
            this._parallaxX += this._displayX - lastX;
        }
    };

    scrollRight(distance: number) {
        if (this.isLoopHorizontal()) {
            this._displayX += distance;
            this._displayX %= $dataMap.width;
            if (this._parallaxLoopX) {
                this._parallaxX += distance;
            }
        } else if (this.width() >= this.screenTileX()) {
            var lastX = this._displayX;
            this._displayX = Math.min(this._displayX + distance,
                this.width() - this.screenTileX());
            this._parallaxX += this._displayX - lastX;
        }
    };

    scrollUp(distance: number) {
        if (this.isLoopVertical()) {
            this._displayY += $dataMap.height - distance;
            this._displayY %= $dataMap.height;
            if (this._parallaxLoopY) {
                this._parallaxY -= distance;
            }
        } else if (this.height() >= this.screenTileY()) {
            var lastY = this._displayY;
            this._displayY = Math.max(this._displayY - distance, 0);
            this._parallaxY += this._displayY - lastY;
        }
    };

    isValid(x: number, y: number) {
        return x >= 0 && x < this.width() && y >= 0 && y < this.height();
    };

    checkPassage(x: number, y: number, bit: number) {
        var flags = this.tilesetFlags();
        var tiles = this.allTiles(x, y);
        for (var i = 0; i < tiles.length; i++) {
            var flag = flags[tiles[i]];
            if ((flag & 0x10) !== 0)  // [*] No effect on passage
                continue;
            if ((flag & bit) === 0)   // [o] Passable
                return true;
            if ((flag & bit) === bit) // [x] Impassable
                return false;
        }
        return false;
    };

    tileId(x: number, y: number, z: number) {
        var width = $dataMap.width;
        var height = $dataMap.height;
        return $dataMap.data[(z * height + y) * width + x] || 0;
    };

    layeredTiles(x: number, y: number) {
        var tiles = [];
        for (var i = 0; i < 4; i++) {
            tiles.push(this.tileId(x, y, 3 - i));
        }
        return tiles;
    };

    allTiles(x: number, y: number) {
        var tiles = this.tileEventsXy(x, y).map(function (event) {
            return event.tileId();
        });
        return tiles.concat(this.layeredTiles(x, y));
    };

    autotileType(x: number, y: number, z: number) {
        var tileId = this.tileId(x, y, z);
        return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
    };

    isPassable(x: number, y: number, d: number) {
        return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
    };

    isBoatPassable(x: number, y: number) {
        return this.checkPassage(x, y, 0x0200);
    };

    isShipPassable(x: number, y: number) {
        return this.checkPassage(x, y, 0x0400);
    };

    isAirshipLandOk(x: number, y: number) {
        return this.checkPassage(x, y, 0x0800) && this.checkPassage(x, y, 0x0f);
    };

    checkLayeredTilesFlags(x: number, y: number, bit: number) {
        var flags = this.tilesetFlags();
        return this.layeredTiles(x, y).some(function (tileId) {
            return (flags[tileId] & bit) !== 0;
        });
    };

    isLadder(x: number, y: number) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
    };

    isBush(x: number, y: number) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
    };

    isCounter(x: number, y: number) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
    };

    isDamageFloor(x: number, y: number) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
    };

    terrainTag(x: number, y: number) {
        if (this.isValid(x, y)) {
            var flags = this.tilesetFlags();
            var tiles = this.layeredTiles(x, y);
            for (var i = 0; i < tiles.length; i++) {
                var tag = flags[tiles[i]] >> 12;
                if (tag > 0) {
                    return tag;
                }
            }
        }
        return 0;
    };

    regionId(x: number, y: number) {
        return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
    };

    startScroll(direction: number, distance: number, speed: number) {
        this._scrollDirection = direction;
        this._scrollRest = distance;
        this._scrollSpeed = speed;
    };

    isScrolling() {
        return this._scrollRest > 0;
    };

    update(sceneActive: boolean) {
        this.refreshIfNeeded();
        if (sceneActive) {
            this.updateInterpreter();
        }
        this.updateScroll();
        this.updateEvents();
        this.updateVehicles();
        this.updateParallax();
    };

    updateScroll() {
        if (this.isScrolling()) {
            var lastX = this._displayX;
            var lastY = this._displayY;
            this.doScroll(this._scrollDirection, this.scrollDistance());
            if (this._displayX === lastX && this._displayY === lastY) {
                this._scrollRest = 0;
            } else {
                this._scrollRest -= this.scrollDistance();
            }
        }
    };

    scrollDistance(): number {
        return Math.pow(2, this._scrollSpeed) / 256;
    };

    doScroll(direction: number, distance: number) {
        switch (direction) {
            case 2:
                this.scrollDown(distance);
                break;
            case 4:
                this.scrollLeft(distance);
                break;
            case 6:
                this.scrollRight(distance);
                break;
            case 8:
                this.scrollUp(distance);
                break;
        }
    };

    updateEvents() {
        this.events().forEach(function (event) {
            event.update();
        });
        this._commonEvents.forEach(function (event) {
            event.update();
        });
    };

    updateVehicles() {
        this._vehicles.forEach(function (vehicle) {
            vehicle.update();
        });
    };

    updateParallax() {
        if (this._parallaxLoopX) {
            this._parallaxX += this._parallaxSx / this.tileWidth() / 2;
        }
        if (this._parallaxLoopY) {
            this._parallaxY += this._parallaxSy / this.tileHeight() / 2;
        }
    };

    changeTileset(tilesetId: number) {
        this._tilesetId = tilesetId;
        this.refresh();
    };

    changeBattleback(battleback1Name: string, battleback2Name: string) {
        this._battleback1Name = battleback1Name;
        this._battleback2Name = battleback2Name;
    };

    changeParallax(name: string, loopX: boolean, loopY: boolean, sx: number, sy: number) {
        this._parallaxName = name;
        this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
        if (this._parallaxLoopX && !loopX) {
            this._parallaxX = 0;
        }
        if (this._parallaxLoopY && !loopY) {
            this._parallaxY = 0;
        }
        this._parallaxLoopX = loopX;
        this._parallaxLoopY = loopY;
        this._parallaxSx = sx;
        this._parallaxSy = sy;
    };

    updateInterpreter() {
        for (; ;) {
            this._interpreter.update();
            if (this._interpreter.isRunning()) {
                return;
            }
            if (this._interpreter.eventId() > 0) {
                this.unlockEvent(this._interpreter.eventId());
                this._interpreter.clear();
            }
            if (!this.setupStartingEvent()) {
                return;
            }
        }
    };

    unlockEvent(eventId: number) {
        if (this._events[eventId]) {
            this._events[eventId].unlock();
        }
    };

    setupStartingEvent() {
        this.refreshIfNeeded();
        if (this._interpreter.setupReservedCommonEvent()) {
            return true;
        }
        if (this.setupTestEvent()) {
            return true;
        }
        if (this.setupStartingMapEvent()) {
            return true;
        }
        if (this.setupAutorunCommonEvent()) {
            return true;
        }
        return false;
    };

    setupTestEvent() {
        if ($testEvent) {
            this._interpreter.setup($testEvent, 0);
            $testEvent = null;
            return true;
        }
        return false;
    };

    setupStartingMapEvent() {
        var events = this.events();
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            if (event.isStarting()) {
                event.clearStartingFlag();
                this._interpreter.setup(event.list(), event.eventId());
                return true;
            }
        }
        return false;
    };

    setupAutorunCommonEvent() {
        for (var i = 0; i < $dataCommonEvents.length; i++) {
            var event = $dataCommonEvents[i];
            if (event && event.trigger === 1 && $gameSwitches.value(event.switchId)) {
                this._interpreter.setup(event.list);
                return true;
            }
        }
        return false;
    };

    isAnyEventStarting() {
        return this.events().some(function (event) {
            return event.isStarting();
        });
    };

}

