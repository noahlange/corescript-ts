//-----------------------------------------------------------------------------
// Game_Switches
//
// The game object class for switches.

class Game_Switches {
    protected _data;

    constructor() {
        this.clear();
    };
    
    clear() {
        this._data = [];
    };
    
    value(switchId: number) {
        return !!this._data[switchId];
    };
    
    setValue(switchId: number, value) {
        if (switchId > 0 && switchId < $dataSystem.switches.length) {
            this._data[switchId] = value;
            this.onChange();
        }
    };
    
    onChange() {
        $gameMap.requestRefresh();
    };
        
}

