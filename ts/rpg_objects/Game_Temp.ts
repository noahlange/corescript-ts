//-----------------------------------------------------------------------------
// Game_Temp
//
// The game object class for temporary data that is not included in save data.

class Game_Temp {
    protected _isPlaytest: boolean;
    protected _commonEventId: number;
    protected _destinationX: number|null;
    protected _destinationY: number|null;


    constructor() {
        this._isPlaytest = Utils.isOptionValid('test');
        this._commonEventId = 0;
        this._destinationX = null;
        this._destinationY = null;
    };

    isPlaytest() {
        return this._isPlaytest;
    };

    reserveCommonEvent(commonEventId: number) {
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

    setDestination(x: number, y: number) {
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

    destinationX(): number {
        return this._destinationX;
    };

    destinationY(): number {
        return this._destinationY;
    };

}

