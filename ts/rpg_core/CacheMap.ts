/**
 * Cache for images, audio, or any other kind of resource
 * @param manager
 * @constructor
 */
class CacheMap {
    public manager: any;
    protected _inner: Object;
    protected _lastRemovedEntries: Object | any[];
    public updateTicks: number;
    public lastCheckTTL: number;
    public delayCheckTTL: number;
    public updateSeconds: number;

    constructor(manager) {
        this.manager = manager;
        this._inner = {};
        this._lastRemovedEntries = {};
        this.updateTicks = 0;
        this.lastCheckTTL = 0;
        this.delayCheckTTL = 100.0;
        this.updateSeconds = Date.now();
    }

    /**
     * checks ttl of all elements and removes dead ones
     */
    checkTTL() {
        var cache = this._inner;
        var temp = this._lastRemovedEntries as any[];
        if (!temp) {
            temp = [];
            this._lastRemovedEntries = temp;
        }

        for (var key in cache) {
            var entry = cache[key];
            if (!entry.isStillAlive()) {
                temp.push(entry);
            }
        }
        for (var i = 0; i < temp.length; i++) {
            temp[i].free(true);
        }
        temp.length = 0;
    };

    /**
     * cache item
     * @param key url of cache element
     * @returns {*|null}
     */
    getItem(key) {
        var entry = this._inner[key];
        if (entry) {
            return entry.item;
        }
        return null;
    };

    clear() {
        var keys = Object.keys(this._inner);
        for (var i = 0; i < keys.length; i++) {
            this._inner[keys[i]].free();
        }
    };

    setItem(key, item) {
        return new CacheEntry(this, key, item).allocate();
    };

    update(ticks, delta) {
        this.updateTicks += ticks;
        this.updateSeconds += delta;
        if (this.updateSeconds >= this.delayCheckTTL + this.lastCheckTTL) {
            this.lastCheckTTL = this.updateSeconds;
            this.checkTTL();
        }
    };

}
