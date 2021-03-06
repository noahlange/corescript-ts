import $ from '$';
import Window_BattleStatus from './Window_BattleStatus';
import Game_Actor from '../rpg_objects/Game_Actor';

//-----------------------------------------------------------------------------
// Window_BattleActor
//
// The window for selecting a target actor on the battle screen.

export default class Window_BattleActor extends Window_BattleStatus {

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.openness = 255;
        this.hide();
    };
    
    show() {
        this.select(0);
        super.show();
    };
    
    hide() {
        super.hide();
        $.gameParty.select(null);
    };
    
    select(index: number) {
        super.select( index);
        $.gameParty.select(this.actor());
    };
    
    actor() {
        return $.gameParty.members()[this.index()];
    };
    
}
