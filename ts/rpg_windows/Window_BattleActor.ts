//-----------------------------------------------------------------------------
// Window_BattleActor
//
// The window for selecting a target actor on the battle screen.


class Window_BattleActor extends Window_BattleStatus {

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.openness = 255;
        this.hide();
    };
    
    show() {
        this.select(0);
        Window_BattleStatus.prototype.show.call(this);
    };
    
    hide() {
        Window_BattleStatus.prototype.hide.call(this);
        $gameParty.select(null);
    };
    
    select(index) {
        Window_BattleStatus.prototype.select.call(this, index);
        $gameParty.select(this.actor());
    };
    
    actor() {
        return $gameParty.members()[this.index()];
    };
    
}
