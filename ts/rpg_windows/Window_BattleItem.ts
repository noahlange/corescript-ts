//-----------------------------------------------------------------------------
// Window_BattleItem
//
// The window for selecting an item to use on the battle screen.

class Window_BattleItem extends Window_ItemList {

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this.hide();
    };

    includes(item) {
        return $gameParty.canUse(item);
    };

    show() {
        this.selectLast();
        this.showHelpWindow();
        super.show();
    };

    hide() {
        this.hideHelpWindow();
        super.hide();
    };

}
