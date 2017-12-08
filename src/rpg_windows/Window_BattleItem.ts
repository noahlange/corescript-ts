import Window_ItemList from './Window_ItemList';

//-----------------------------------------------------------------------------
// Window_BattleItem
//
// The window for selecting an item to use on the battle screen.

export default class Window_BattleItem extends Window_ItemList {

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this.hide();
    };

    includes(item: Object) {
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
