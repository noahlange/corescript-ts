//-----------------------------------------------------------------------------
// Game_SelfSwitches
//
// The game object class for self switches.

class Game_SelfSwitches {
    protected _data: object;

    constructor() {
        this.clear();
    };
    
    clear() {
        this._data = {};
    };
    
    /// NOTE(bungcip: changed to any because weird line in Game_Event.ts: 224)
    value(key: any) {
        return !!(this._data as any)[key];
    };
    
    setValue(key: any, value: boolean) {
        if (value) {
            (this._data as any)[key] = true;
        } else {
            delete (this._data as any)[key];
        }
        this.onChange();
    };
    
    onChange() {
        $gameMap.requestRefresh();
    };
        
}

