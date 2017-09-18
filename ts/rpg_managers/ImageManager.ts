//-----------------------------------------------------------------------------
// ImageManager
//
// The static class that loads images, creates bitmap objects and retains them.

class ImageManager {
    static cache = new CacheMap(ImageManager);
    
    protected static _imageCache = new ImageCache();
    protected static _requestQueue = new RequestQueue();
    protected static _systemReservationId = Utils.generateRuntimeId();
    
    protected static _generateCacheKey(path, hue){
        return  path + ':' + hue;
    };
    
    static loadAnimation(filename, hue?) {
        return this.loadBitmap('img/animations/', filename, hue, true);
    };
    
    static loadBattleback1(filename, hue?) {
        return this.loadBitmap('img/battlebacks1/', filename, hue, true);
    };
    
    static loadBattleback2(filename, hue?) {
        return this.loadBitmap('img/battlebacks2/', filename, hue, true);
    };
    
    static loadEnemy(filename, hue?) {
        return this.loadBitmap('img/enemies/', filename, hue, true);
    };
    
    static loadCharacter(filename, hue?) {
        return this.loadBitmap('img/characters/', filename, hue, false);
    };
    
    static loadFace(filename, hue?) {
        return this.loadBitmap('img/faces/', filename, hue, true);
    };
    
    static loadParallax(filename, hue?) {
        return this.loadBitmap('img/parallaxes/', filename, hue, true);
    };
    
    static loadPicture(filename, hue?) {
        return this.loadBitmap('img/pictures/', filename, hue, true);
    };
    
    static loadSvActor(filename, hue?) {
        return this.loadBitmap('img/sv_actors/', filename, hue, false);
    };
    
    static loadSvEnemy(filename, hue) {
        return this.loadBitmap('img/sv_enemies/', filename, hue, true);
    };
    
    static loadSystem(filename, hue?) {
        return this.loadBitmap('img/system/', filename, hue, false);
    };
    
    static loadTileset(filename, hue?) {
        return this.loadBitmap('img/tilesets/', filename, hue, false);
    };
    
    static loadTitle1(filename, hue?) {
        return this.loadBitmap('img/titles1/', filename, hue, true);
    };
    
    static loadTitle2(filename, hue?) {
        return this.loadBitmap('img/titles2/', filename, hue, true);
    };
    
    static loadBitmap(folder, filename, hue, smooth) {
        if (filename) {
            var path = folder + encodeURIComponent(filename) + '.png';
            var bitmap = this.loadNormalBitmap(path, hue || 0);
            bitmap.smooth = smooth;
            return bitmap;
        } else {
            return this.loadEmptyBitmap();
        }
    };
    
    static loadEmptyBitmap() {
        var empty = this._imageCache.get('empty');
        if(!empty){
            empty = new Bitmap();
            this._imageCache.add('empty', empty);
            this._imageCache.reserve('empty', empty, this._systemReservationId);
        }
    
        return empty;
    };
    
    static loadNormalBitmap(path, hue) {
        var key = this._generateCacheKey(path, hue);
        var bitmap = this._imageCache.get(key);
        if (!bitmap) {
            bitmap = Bitmap.load(path);
            bitmap.addLoadListener(function() {
                bitmap.rotateHue(hue);
            });
            this._imageCache.add(key, bitmap);
        }else if(!bitmap.isReady()){
            bitmap.decode();
        }
    
        return bitmap;
    };
    
    static clear() {
        this._imageCache = new ImageCache();
    };
    
    static isReady() {
        return this._imageCache.isReady();
    };
    
    static isObjectCharacter(filename: string) {
        var sign = filename.match(/^[\!\$]+/);
        return sign && sign[0].contains('!');
    };
    
    static isBigCharacter(filename: string) {
        var sign = filename.match(/^[\!\$]+/);
        return sign && sign[0].contains('$');
    };
    
    static isZeroParallax(filename: string) {
        return filename.charAt(0) === '!';
    };
    
    
    static reserveAnimation(filename: string, hue, reservationId) {
        return this.reserveBitmap('img/animations/', filename, hue, true, reservationId);
    };
    
    static reserveBattleback1(filename: string, hue, reservationId) {
        return this.reserveBitmap('img/battlebacks1/', filename, hue, true, reservationId);
    };
    
    static reserveBattleback2(filename: string, hue, reservationId) {
        return this.reserveBitmap('img/battlebacks2/', filename, hue, true, reservationId);
    };
    
    static reserveEnemy(filename: string, hue, reservationId) {
        return this.reserveBitmap('img/enemies/', filename, hue, true, reservationId);
    };
    
    static reserveCharacter(filename: string, hue?, reservationId?) {
        return this.reserveBitmap('img/characters/', filename, hue, false, reservationId);
    };
    
    static reserveFace(filename: string, hue?, reservationId?) {
        return this.reserveBitmap('img/faces/', filename, hue, true, reservationId);
    };
    
    static reserveParallax(filename: string, hue, reservationId) {
        return this.reserveBitmap('img/parallaxes/', filename, hue, true, reservationId);
    };
    
    static reservePicture(filename: string, hue, reservationId) {
        return this.reserveBitmap('img/pictures/', filename, hue, true, reservationId);
    };
    
    static reserveSvActor(filename: string, hue, reservationId) {
        return this.reserveBitmap('img/sv_actors/', filename, hue, false, reservationId);
    };
    
    static reserveSvEnemy(filename: string, hue, reservationId) {
        return this.reserveBitmap('img/sv_enemies/', filename, hue, true, reservationId);
    };
    
    static reserveSystem(filename: string, hue?, reservationId?) {
        return this.reserveBitmap('img/system/', filename, hue, false, reservationId || this._systemReservationId);
    };
    
    static reserveTileset(filename: string, hue, reservationId) {
        return this.reserveBitmap('img/tilesets/', filename, hue, false, reservationId);
    };
    
    static reserveTitle1(filename: string, hue, reservationId) {
        return this.reserveBitmap('img/titles1/', filename, hue, true, reservationId);
    };
    
    static reserveTitle2(filename: string, hue, reservationId) {
        return this.reserveBitmap('img/titles2/', filename, hue, true, reservationId);
    };
    
    protected static _defaultReservationId;
    static reserveBitmap(folder: string, filename: string, hue, smooth, reservationId) {
        if (filename) {
            var path = folder + encodeURIComponent(filename) + '.png';
            var bitmap = this.reserveNormalBitmap(path, hue || 0, reservationId || this._defaultReservationId);
            bitmap.smooth = smooth;
            return bitmap;
        } else {
            return this.loadEmptyBitmap();
        }
    };
    
    static reserveNormalBitmap(path: string, hue, reservationId){
        var bitmap = this.loadNormalBitmap(path, hue);
        this._imageCache.reserve(this._generateCacheKey(path, hue), bitmap, reservationId);
    
        return bitmap;
    };
    
    static releaseReservation(reservationId){
        this._imageCache.releaseReservation(reservationId);
    };
    
    static setDefaultReservationId(reservationId){
        this._defaultReservationId = reservationId;
    };
    
    
    static requestAnimation(filename: string, hue) {
        return this.requestBitmap('img/animations/', filename, hue, true);
    };
    
    static requestBattleback1(filename: string, hue?) {
        return this.requestBitmap('img/battlebacks1/', filename, hue, true);
    };
    
    static requestBattleback2(filename: string, hue?) {
        return this.requestBitmap('img/battlebacks2/', filename, hue, true);
    };
    
    static requestEnemy(filename: string, hue?) {
        return this.requestBitmap('img/enemies/', filename, hue, true);
    };
    
    static requestCharacter(filename: string, hue?) {
        return this.requestBitmap('img/characters/', filename, hue, false);
    };
    
    static requestFace(filename: string, hue?) {
        return this.requestBitmap('img/faces/', filename, hue, true);
    };
    
    static requestParallax(filename: string, hue?) {
        return this.requestBitmap('img/parallaxes/', filename, hue, true);
    };
    
    static requestPicture(filename: string, hue?) {
        return this.requestBitmap('img/pictures/', filename, hue, true);
    };
    
    static requestSvActor(filename: string, hue?) {
        return this.requestBitmap('img/sv_actors/', filename, hue, false);
    };
    
    static requestSvEnemy(filename: string, hue) {
        return this.requestBitmap('img/sv_enemies/', filename, hue, true);
    };
    
    static requestSystem(filename: string, hue) {
        return this.requestBitmap('img/system/', filename, hue, false);
    };
    
    static requestTileset(filename: string, hue?) {
        return this.requestBitmap('img/tilesets/', filename, hue, false);
    };
    
    static requestTitle1(filename: string, hue?) {
        return this.requestBitmap('img/titles1/', filename, hue, true);
    };
    
    static requestTitle2(filename: string, hue?) {
        return this.requestBitmap('img/titles2/', filename, hue, true);
    };
    
    static requestBitmap(folder: string, filename: string, hue, smooth) {
        if (filename) {
            var path = folder + encodeURIComponent(filename) + '.png';
            var bitmap = this.requestNormalBitmap(path, hue || 0);
            bitmap.smooth = smooth;
            return bitmap;
        } else {
            return this.loadEmptyBitmap();
        }
    };
    
    static requestNormalBitmap(path: string, hue){
        var key = this._generateCacheKey(path, hue);
        var bitmap = this._imageCache.get(key);
        if(!bitmap){
            bitmap = Bitmap.request(path);
            bitmap.addLoadListener(function(){
                bitmap.rotateHue(hue);
            });
            this._imageCache.add(key, bitmap);
            this._requestQueue.enqueue(key, bitmap);
        }else{
            this._requestQueue.raisePriority(key);
        }
    
        return bitmap;
    };
    
    static update(){
        this._requestQueue.update();
    };
    
    static clearRequest(){
        this._requestQueue.clear();
    };
        
}


