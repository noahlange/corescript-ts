import CacheMap from './CacheMap';

/**
 * The resource class. Allows to be collected as a garbage if not use for some time or ticks
 */
export default class CacheEntry {
  public cache: CacheMap;
  public key: string;
  public item: string;
  public touchTicks: number = 0;
  public touchSeconds: number = 0;
  public ttlSeconds: number = 0;
  public ttlTicks: number = 0;
  public cached: boolean = false;
  public freedByTTL: boolean = false;

  public constructor(
    /* manager */
    cache: any,
    /* url of the resource */
    key: string,
    /** Bitmap, HTML5Audio, WebAudio - whatever you want to store in the cache */
    item: string
  ) {
    this.cache = cache;
    this.key = key;
    this.item = item;
  }

  /**
   * frees the resource
   */
  public free(byTTL: boolean = false) {
    this.freedByTTL = byTTL;
    if (this.cached) {
      this.cached = false;
      this.cache.deleteEntry(this.key);
    }
  }

  /**
   * Allocates the resource
   */
  public allocate(): this {
    if (!this.cached) {
      this.cache.setEntry(this.key, this);
      this.cached = true;
    }
    this.touch();
    return this;
  }

  /**
   * Sets the time to live
   */
  public setTimeToLive(
    /* TTL in ticks, 0 if not set */
    ticks: number = 0,
    /* TTL in seconds, 0 if not set */
    seconds: number = 0
  ): this {
    this.ttlTicks = ticks;
    this.ttlSeconds = seconds;
    return this;
  }

  public isStillAlive() {
    const cache = this.cache;
    return (
      (this.ttlTicks === 0 ||
        this.touchTicks + this.ttlTicks < cache.updateTicks) &&
      (this.ttlSeconds === 0 ||
        this.touchSeconds + this.ttlSeconds < cache.updateSeconds)
    );
  }

  /**
   * makes sure that resource won't be freed by Time To Live
   * if resource was already freed by TTL, put it in cache again
   */
  public touch() {
    const cache = this.cache;
    if (this.cached) {
      this.touchTicks = cache.updateTicks;
      this.touchSeconds = cache.updateSeconds;
    } else if (this.freedByTTL) {
      this.freedByTTL = false;
      if (!cache.getEntry(this.key)) {
        cache.setEntry(this.key, this);
      }
    }
  }
}
