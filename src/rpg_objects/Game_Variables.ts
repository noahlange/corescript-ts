import $ from '$';

//-----------------------------------------------------------------------------
// Game_Variables
//
// The game object class for variables.

export default class Game_Variables {
    /// (bungcip): set to public because Game_Action required it
    public _data: number[];

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
        if (variableId > 0 && variableId < $.dataSystem.variables.length) {
            if (typeof value === 'number') {
                value = Math.floor(value);
            }
            this._data[variableId] = value;
            this.onChange();
        }
    };
    
    onChange() {
        $.gameMap.requestRefresh();
    };
        
}

