//-----------------------------------------------------------------------------
// Game_Temp
//
// The game object class for temporary data that is not included in save data.

class Game_Temp {
    protected _isPlaytest;
    protected _commonEventId;
    protected _destinationX;
    protected _destinationY;


    constructor() {
        this._isPlaytest = Utils.isOptionValid('test');
        this._commonEventId = 0;
        this._destinationX = null;
        this._destinationY = null;
    };
    
    isPlaytest() {
        return this._isPlaytest;
    };
    
    reserveCommonEvent(commonEventId) {
        this._commonEventId = commonEventId;
    };
    
    clearCommonEvent() {
        this._commonEventId = 0;
    };
    
    isCommonEventReserved() {
        return this._commonEventId > 0;
    };
    
    reservedCommonEvent() {
        return $dataCommonEvents[this._commonEventId];
    };
    
    setDestination(x, y) {
        this._destinationX = x;
        this._destinationY = y;
    };
    
    clearDestination() {
        this._destinationX = null;
        this._destinationY = null;
    };
    
    isDestinationValid() {
        return this._destinationX !== null;
    };
    
    destinationX() {
        return this._destinationX;
    };
    
    destinationY() {
        return this._destinationY;
    };
        
}

