import $ from '$';
import Game_Interpreter from './Game_Interpreter';

//-----------------------------------------------------------------------------
// Game_CommonEvent
//
// The game object class for a common event. It contains functionality for
// running parallel process events.

export default class Game_CommonEvent {
    protected _commonEventId: number;
    protected _interpreter: Game_Interpreter;

    constructor(commonEventId: number) {
        this._commonEventId = commonEventId;
        this.refresh();
    };
    
    event() {
        return $.dataCommonEvents[this._commonEventId];
    };
    
    list() {
        return this.event().list;
    };
    
    refresh() {
        if (this.isActive()) {
            if (!this._interpreter) {
                this._interpreter = new Game_Interpreter();
            }
        } else {
            this._interpreter = null;
        }
    };
    
    isActive() {
        const event = this.event();
        return event.trigger === 2 && $.gameSwitches.value(event.switchId);
    };
    
    update() {
        if (this._interpreter) {
            if (!this._interpreter.isRunning()) {
                this._interpreter.setup(this.list());
            }
            this._interpreter.update();
        }
    };
        
}

