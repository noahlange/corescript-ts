import Bitmap from './Bitmap';

export interface ImageCacheItem {
  bitmap: Bitmap;
  touch: number;
  key: string;
  reservationId?: number;
}

export interface ImageCacheItems {
  [key: string]: ImageCacheItem;
}

export default class ImageCache {
  public static limit = 10 * 1000 * 1000;
  protected _items: ImageCacheItems = {};

  public add(key: string, bitmap: Bitmap) {
    this._items[key] = { bitmap, touch: Date.now(), key };
    this._truncateCache();
  }

  public get(key: string): Bitmap | null {
    if (this._items[key]) {
      const item = this._items[key];
      item.touch = Date.now();
      return item.bitmap;
    }
    return null;
  }

  public reserve(key: string, bitmap: Bitmap, reservationId: number) {
    if (!this._items[key]) {
      this._items[key] = { bitmap, touch: Date.now(), key };
    }
    this._items[key].reservationId = reservationId;
  }

  public releaseReservation(reservationId: number) {
    const items = this._items;
    Object.keys(items)
      .map(key => items[key])
      .forEach(item => {
        if (item.reservationId === reservationId) {
          delete item.reservationId;
        }
      });
  }

  public isReady(): boolean {
    const items = this._items;
    return !Object.keys(items).some(
      key => !items[key].bitmap.isRequestOnly() && !items[key].bitmap.isReady()
    );
  }

  public getErrorBitmap(): null | boolean | Bitmap {
    const items = this._items;
    let bitmap = null;
    if (
      Object.keys(items).some(key => {
        if (items[key].bitmap.isError()) {
          bitmap = items[key].bitmap;
          return true;
        }
        return false;
      })
    ) {
      return bitmap;
    }

    return null;
  }

  protected _truncateCache(): void {
    const items = this._items;
    let sizeLeft = ImageCache.limit;

    Object.keys(items)
      .map(key => items[key])
      .sort((a, b) => b.touch - a.touch)
      .forEach((item: any) => {
        if (sizeLeft > 0 || this._mustBeHeld(item)) {
          const bitmap = item.bitmap;
          sizeLeft -= bitmap.width * bitmap.height;
        } else {
          delete items[item.key];
        }
      });
  }

  protected _mustBeHeld(item: ImageCacheItem): boolean {
    // request only is weak so It's purgeable
    if (item.bitmap.isRequestOnly()) {
      return false;
    }
    // reserved item must be held
    if (item.reservationId) {
      return true;
    }
    // not ready bitmap must be held (because of checking isReady())
    if (!item.bitmap.isReady()) {
      return true;
    }
    // then the item may purgeable
    return false;
  }
}
