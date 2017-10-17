//-----------------------------------------------------------------------------
/**
 * The resource class. Allows to be collected as a garbage if not use for some time or ticks
 *
 * @class CacheEntry
 * @constructor
 * @param {ResourceManager} resource manager
 * @param {string} key, url of the resource
 * @param {string} item - Bitmap, HTML5Audio, WebAudio - whatever you want to store in the cache
 */
class CacheEntry {
    public cache: any;
    public key: string;
    public item: string;
    public cached: boolean = false;
    public touchTicks: number = 0;
    public touchSeconds: number = 0;
    public ttlSeconds: number = 0;
    public ttlTicks: number = 0;
    public freedByTTL: boolean = false;

    constructor(cache: any, key: string, item: string) {
        this.cache = cache;
        this.key = key;
        this.item = item;
    }

    /**
     * frees the resource
     */
    free(byTTL: boolean = false) {
        this.freedByTTL = byTTL;
        if (this.cached) {
            this.cached = false;
            delete this.cache._inner[this.key];
        }
    };

    /**
     * Allocates the resource
     * @returns {CacheEntry}
     */
    allocate() {
        if (!this.cached) {
            this.cache._inner[this.key] = this;
            this.cached = true;
        }
        this.touch();
        return this;
    };

    /**
     * Sets the time to live
     * @param {number} ticks TTL in ticks, 0 if not set
     * @param {number} time TTL in seconds, 0 if not set
     * @returns {CacheEntry}
     */
    setTimeToLive(ticks: number = 0, seconds: number = 0) {
        this.ttlTicks = ticks;
        this.ttlSeconds = seconds;
        return this;
    };

    isStillAlive() {
        const cache = this.cache;
        return ((this.ttlTicks == 0) || (this.touchTicks + this.ttlTicks < cache.updateTicks)) &&
            ((this.ttlSeconds == 0) || (this.touchSeconds + this.ttlSeconds < cache.updateSeconds));
    };

    /**
     * makes sure that resource wont freed by Time To Live
     * if resource was already freed by TTL, put it in cache again
     */
    touch() {
        const cache = this.cache;
        if (this.cached) {
            this.touchTicks = cache.updateTicks;
            this.touchSeconds = cache.updateSeconds;
        } else if (this.freedByTTL) {
            this.freedByTTL = false;
            if (!cache._inner[this.key]) {
                cache._inner[this.key] = this;
            }
        }
    };


}

