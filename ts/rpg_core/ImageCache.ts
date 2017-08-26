class ImageCache {
    static limit = 10 * 1000 * 1000;

    protected _items: Object;

    constructor() {
        this._items = {};
    };

    add(key, value) {
        this._items[key] = {
            bitmap: value,
            touch: Date.now(),
            key: key
        };

        this._truncateCache();
    };

    get(key) {
        if (this._items[key]) {
            var item = this._items[key];
            item.touch = Date.now();
            return item.bitmap;
        }

        return null;
    };

    reserve(key, value, reservationId) {
        if (!this._items[key]) {
            this._items[key] = {
                bitmap: value,
                touch: Date.now(),
                key: key
            };
        }

        this._items[key].reservationId = reservationId;
    };

    releaseReservation(reservationId) {
        var items = this._items;

        Object.keys(items)
            .map(function (key) { return items[key]; })
            .forEach(function (item) {
                if (item.reservationId === reservationId) {
                    delete item.reservationId;
                }
            });
    };

    _truncateCache() {
        var items = this._items;
        var sizeLeft = ImageCache.limit;

        Object.keys(items).map(function (key) {
            return items[key];
        }).sort(function (a, b) {
            return b.touch - a.touch;
        }).forEach(function (item) {
            if (sizeLeft > 0 || this._mustBeHeld(item)) {
                var bitmap = item.bitmap;
                sizeLeft -= bitmap.width * bitmap.height;
            } else {
                delete items[item.key];
            }
        }.bind(this));
    };

    _mustBeHeld(item) {
        // request only is weak so It's purgeable
        if (item.bitmap.isRequestOnly()) return false;
        // reserved item must be held
        if (item.reservationId) return true;
        // not ready bitmap must be held (because of checking isReady())
        if (!item.bitmap.isReady()) return true;
        // then the item may purgeable
        return false;
    };

    isReady() {
        var items = this._items;
        return !Object.keys(items).some(function (key) {
            return !items[key].bitmap.isRequestOnly() && !items[key].bitmap.isReady();
        });
    };

    getErrorBitmap() {
        var items = this._items;
        var bitmap = null;
        if (Object.keys(items).some(function (key) {
            if (items[key].bitmap.isError()) {
                bitmap = items[key].bitmap;
                return true;
            }
            return false;
        })) {
            return bitmap;
        }

        return null;
    };

}



