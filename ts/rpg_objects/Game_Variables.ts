//-----------------------------------------------------------------------------
// Game_Variables
//
// The game object class for variables.

class Game_Variables {
    protected _data;

    constructor() {
        this.clear();
    };
    
    clear() {
        this._data = [];
    };
    
    value(variableId: number) {
        return this._data[variableId] || 0;
    };
    
    setValue(variableId: number, value: number) {
        if (variableId > 0 && variableId < $dataSystem.variables.length) {
            if (typeof value === 'number') {
                value = Math.floor(value);
            }
            this._data[variableId] = value;
            this.onChange();
        }
    };
    
    onChange() {
        $gameMap.requestRefresh();
    };
        
}

