import CacheEntry from './CacheEntry';

export interface IStringMap {
  [key: string]: any;
}

/**
 * Cache for images, audio, or any other kind of resource
 */
export default class CacheMap {
  public updateTicks: number = 0;
  public lastCheckTTL: number = 0;
  public delayCheckTTL: number = 100;
  public updateSeconds: number = Date.now();

  protected _inner: IStringMap = {};
  protected _lastRemovedEntries: any[] = [];

  /**
   * Checks TTL of all elements and removes dead ones
   */
  public checkTTL() {
    const cache = this._inner;
    let temp = this._lastRemovedEntries;
    if (!temp) {
      temp = [];
      this._lastRemovedEntries = temp;
    }
    for (const key of Object.keys(cache)) {
      const entry: any = cache[key];
      if (!entry.isStillAlive()) {
        temp.push(entry);
      }
    }
    for (const item of temp) {
      item.free(true);
    }
    temp.length = 0;
  }

  public getEntry(key: string): CacheEntry {
    return this._inner[key];
  }

  public setEntry(key: string, value: CacheEntry): void {
    this._inner[key] = value;
  }

  public deleteEntry(key: string): void {
    delete this._inner[key];
  }

  /**
   * Retrieve cached item.
   */
  public getItem(
    /** url of cache element */
    key: string
  ): any | null {
    const entry: any = this._inner[key];
    if (entry) {
      return entry.item;
    }
    return null;
  }

  public setItem(key: string, item: any): CacheEntry {
    return new CacheEntry(this, key, item).allocate();
  }

  public clear(): void {
    for (const key of Object.keys(this._inner)) {
      this._inner[key].free();
    }
  }

  public update(ticks: number, delta: number) {
    this.updateTicks += ticks;
    this.updateSeconds += delta;
    if (this.updateSeconds >= this.delayCheckTTL + this.lastCheckTTL) {
      this.lastCheckTTL = this.updateSeconds;
      this.checkTTL();
    }
  }
}
